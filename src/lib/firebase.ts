import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, Product, Review, User, Supplier, AccountingTransaction, PurchaseInvoice, FinancialAccount } from '../types';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firebase Firestore connected successfully (Project: ' + firebaseConfig.projectId + ')');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('⚠️ Please check your Firebase configuration.');
    } else {
      console.log('Firebase connection initialized.');
    }
    return false;
  }
}

// User Profile sync
export async function syncUserProfile(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email || '',
      role: user.role,
      customerType: user.customerType,
      companyName: user.companyName || '',
      taxNumber: user.taxNumber || '',
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }, { merge: true });
  } catch (error) {
    console.warn('Could not sync user profile to Firestore:', error);
  }
}

// Save Order to Firestore
export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      userName: order.userName,
      userPhone: order.userPhone,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      deliveryFee: order.deliveryFee,
      taxAmount: order.taxAmount,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod,
      createdAt: order.createdAt,
      appliedCoupon: order.appliedCoupon || '',
      notes: order.notes || '',
      estimatedDeliveryTime: order.estimatedDeliveryTime || '',
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      trackingHistory: order.trackingHistory
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Update Order status in Firestore
export async function updateOrderStatusInFirestore(orderId: string, status: string, trackingHistory: any[]): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      trackingHistory
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Save Wholesale B2B Request to Firestore
export async function saveWholesaleRequestToFirestore(requestData: {
  facilityName: string;
  contactName: string;
  contactPhone: string;
  activityType: string;
  city: string;
  monthlyCartons?: string;
  notes?: string;
}): Promise<string> {
  const id = `ws_${Date.now()}`;
  const path = `wholesale_requests/${id}`;
  try {
    await setDoc(doc(db, 'wholesale_requests', id), {
      id,
      facilityName: requestData.facilityName,
      contactName: requestData.contactName,
      contactPhone: requestData.contactPhone,
      activityType: requestData.activityType,
      city: requestData.city,
      monthlyCartons: requestData.monthlyCartons || '',
      notes: requestData.notes || '',
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return id;
  }
}

// Save Contact message to Firestore
export async function saveContactMessageToFirestore(msgData: {
  name: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<string> {
  const id = `msg_${Date.now()}`;
  const path = `contact_messages/${id}`;
  try {
    await setDoc(doc(db, 'contact_messages', id), {
      id,
      name: msgData.name,
      phone: msgData.phone,
      subject: msgData.subject,
      message: msgData.message,
      createdAt: new Date().toISOString(),
      status: 'unread'
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return id;
  }
}

// Save Review to Firestore
export async function saveReviewToFirestore(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), {
      id: review.id,
      productId: review.productId,
      productName: review.productName,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      isApproved: review.isApproved
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Save or Update Product to Firestore
export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product, { merge: true });
    console.log(`✅ Product ${product.nameAr} saved to Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Delete Product from Firestore
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
    console.log(`✅ Product ${productId} deleted from Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Save or Update Coupon to Firestore
export async function saveCouponToFirestore(coupon: any): Promise<void> {
  const path = `coupons/${coupon.id}`;
  try {
    await setDoc(doc(db, 'coupons', coupon.id), coupon, { merge: true });
    console.log(`✅ Coupon ${coupon.code} saved to Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Delete Coupon from Firestore
export async function deleteCouponFromFirestore(couponId: string): Promise<void> {
  const path = `coupons/${couponId}`;
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    console.log(`✅ Coupon ${couponId} deleted from Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch all products from Firestore
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, 'products'));
    const list: Product[] = [];
    snap.forEach(d => {
      list.push(d.data() as Product);
    });
    return list;
  } catch (error) {
    console.warn('Could not fetch products from Firestore:', error);
    return [];
  }
}

// Fetch all orders from Firestore
export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  const path = 'orders';
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const list: Order[] = [];
    snap.forEach(d => {
      list.push(d.data() as Order);
    });
    return list;
  } catch (error) {
    console.warn('Could not fetch orders from Firestore:', error);
    return [];
  }
}

// Google Sign-In helper
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

// Email & Password Sign-In
export async function signInWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Email Sign In Error:', error);
    throw error;
  }
}

// Email & Password Registration
export async function registerWithEmailFirebase(email: string, pass: string, displayName: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user && displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error) {
    console.error('Email Registration Error:', error);
    throw error;
  }
}

// Password Reset Email
export async function sendPasswordResetFirebase(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password Reset Error:', error);
    throw error;
  }
}

// Fetch all users from Firestore (Users Table)
export async function fetchUsersFromFirestore(): Promise<User[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    const list: User[] = [];
    snap.forEach(d => {
      list.push(d.data() as User);
    });
    return list;
  } catch (error) {
    console.warn('Could not fetch users from Firestore:', error);
    return [];
  }
}

// Save or Update User in Firestore
export async function saveUserToFirestore(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email || '',
      role: user.role,
      customerType: user.customerType,
      companyName: user.companyName || '',
      taxNumber: user.taxNumber || '',
      isVerified: user.isVerified ?? true,
      createdAt: user.createdAt || new Date().toISOString().slice(0, 10),
      ordersCount: user.ordersCount || 0,
      totalSpent: user.totalSpent || 0,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
    console.log(`✅ User profile ${user.name} saved in Firestore database`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Update specific fields of a User in Firestore
export async function updateUserInFirestore(userId: string, data: Partial<User>): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), data);
    console.log(`✅ User ${userId} updated in Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Delete User from Firestore
export async function deleteUserFromFirestore(userId: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log(`✅ User ${userId} deleted from Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==================== SUPPLIERS FIRESTORE ====================
export async function saveSupplierToFirestore(supplier: Supplier): Promise<void> {
  const path = `suppliers/${supplier.id}`;
  try {
    await setDoc(doc(db, 'suppliers', supplier.id), {
      id: supplier.id,
      name: supplier.name,
      companyName: supplier.companyName,
      phone: supplier.phone,
      email: supplier.email || '',
      city: supplier.city,
      address: supplier.address,
      commercialRegister: supplier.commercialRegister || '',
      suppliedCategories: supplier.suppliedCategories || [],
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit || 0,
      balance: supplier.balance || 0,
      totalPurchases: supplier.totalPurchases || 0,
      totalPaid: supplier.totalPaid || 0,
      notes: supplier.notes || '',
      isActive: supplier.isActive ?? true,
      createdAt: supplier.createdAt || new Date().toISOString().slice(0, 10)
    }, { merge: true });
    console.log(`✅ Supplier ${supplier.companyName} saved in Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteSupplierFromFirestore(supplierId: string): Promise<void> {
  const path = `suppliers/${supplierId}`;
  try {
    await deleteDoc(doc(db, 'suppliers', supplierId));
    console.log(`✅ Supplier ${supplierId} deleted from Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==================== ACCOUNTING TRANSACTIONS FIRESTORE ====================
export async function saveAccountingTransactionToFirestore(tx: AccountingTransaction): Promise<void> {
  const path = `accounting_transactions/${tx.id}`;
  try {
    await setDoc(doc(db, 'accounting_transactions', tx.id), {
      id: tx.id,
      entryNumber: tx.entryNumber,
      type: tx.type,
      date: tx.date,
      amount: tx.amount,
      accountFrom: tx.accountFrom,
      accountTo: tx.accountTo,
      partyType: tx.partyType || 'general',
      partyId: tx.partyId || '',
      partyName: tx.partyName || '',
      category: tx.category,
      description: tx.description,
      referenceNumber: tx.referenceNumber || '',
      paymentMethod: tx.paymentMethod,
      notes: tx.notes || '',
      status: tx.status || 'confirmed',
      createdAt: tx.createdAt || new Date().toISOString(),
      createdBy: tx.createdBy || 'المحاسب'
    }, { merge: true });
    console.log(`✅ Transaction ${tx.entryNumber} saved in Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteAccountingTransactionFromFirestore(txId: string): Promise<void> {
  const path = `accounting_transactions/${txId}`;
  try {
    await deleteDoc(doc(db, 'accounting_transactions', txId));
    console.log(`✅ Transaction ${txId} deleted from Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==================== PURCHASE INVOICES FIRESTORE ====================
export async function savePurchaseInvoiceToFirestore(invoice: PurchaseInvoice): Promise<void> {
  const path = `purchase_invoices/${invoice.id}`;
  try {
    await setDoc(doc(db, 'purchase_invoices', invoice.id), {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      supplierId: invoice.supplierId,
      supplierName: invoice.supplierName,
      supplierPhone: invoice.supplierPhone || '',
      date: invoice.date,
      items: invoice.items,
      subtotal: invoice.subtotal,
      discount: invoice.discount || 0,
      tax: invoice.tax || 0,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      remainingAmount: invoice.remainingAmount,
      paymentStatus: invoice.paymentStatus,
      paymentMethod: invoice.paymentMethod,
      notes: invoice.notes || '',
      status: invoice.status,
      createdAt: invoice.createdAt || new Date().toISOString()
    }, { merge: true });
    console.log(`✅ Purchase Invoice ${invoice.invoiceNumber} saved in Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deletePurchaseInvoiceFromFirestore(invoiceId: string): Promise<void> {
  const path = `purchase_invoices/${invoiceId}`;
  try {
    await deleteDoc(doc(db, 'purchase_invoices', invoiceId));
    console.log(`✅ Purchase Invoice ${invoiceId} deleted from Firestore`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Log out helper
export async function logOutFirebase() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}
