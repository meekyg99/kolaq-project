"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { products as seedProducts, type Product } from "@/data/products";
import { productsApi } from "@/lib/api/products";
import { useAPIProducts } from "./api-products-provider";

export type AdminRole = "admin" | "staff" | "viewer";
export type AccountStatus = "active" | "suspended" | "invited";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AccountStatus;
  lastActive: string;
  totalOrdersManaged: number;
}

export type NotificationAudience = "admin" | "user" | "all";
export type NotificationSeverity = "info" | "warning" | "critical";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  severity: NotificationSeverity;
  createdAt: string;
  read: boolean;
}

export type ActivityEntityType = "product" | "user" | "system";

export interface AdminActivity {
  id: string;
  entityType: ActivityEntityType;
  entityId?: string;
  summary: string;
  details?: string;
  createdAt: string;
  author: string;
  severity: NotificationSeverity;
}

interface InventoryState {
  products: Product[];
  users: AdminUser[];
  notifications: AdminNotification[];
  activity: AdminActivity[];
}

type ProductInput = Omit<Product, "id" | "slug"> & { slug?: string };

type InventoryAction =
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; productId: string; payload: Partial<Product> }
  | { type: "DELETE_PRODUCT"; productId: string }
  | { type: "ADD_USER"; payload: AdminUser }
  | { type: "UPDATE_USER"; userId: string; payload: Partial<AdminUser> }
  | { type: "DELETE_USER"; userId: string }
  | { type: "ADD_NOTIFICATION"; payload: AdminNotification }
  | { type: "MARK_NOTIFICATION"; notificationId: string; read: boolean }
  | { type: "MARK_ALL_NOTIFICATIONS" }
  | { type: "LOG_ACTIVITY"; payload: AdminActivity };

const STORAGE_KEY = "kolaq-admin-state-v1";

const InventoryContext = createContext<{
  state: InventoryState;
  addProduct: (input: ProductInput) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  adjustStock: (productId: string, stock: number) => void;
  addUser: (user: Omit<AdminUser, "id">) => AdminUser;
  updateUser: (userId: string, updates: Partial<AdminUser>) => void;
  deleteUser: (userId: string) => void;
  addNotification: (input: Omit<AdminNotification, "id" | "createdAt" | "read">) => AdminNotification;
  markNotification: (notificationId: string, read?: boolean) => void;
  markAllNotifications: () => void;
} | null>(null);

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeState(state?: InventoryState): InventoryState {
  if (!state) {
    return {
      products: seedProducts,
      users: [
        {
          id: "user-admin",
          name: "KOLAQ ALAGBO BITTERS Operations",
          email: "ops@kolaqalagbobitters.com",
          role: "admin",
          status: "active",
          lastActive: new Date().toISOString(),
          totalOrdersManaged: 128,
        },
        {
          id: "user-fulfilment",
          name: "KOLAQ ALAGBO BITTERS Fulfilment",
          email: "fulfilment@kolaqalagbobitters.com",
          role: "staff",
          status: "active",
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          totalOrdersManaged: 84,
        },
        {
          id: "user-retail",
          name: "KOLAQ ALAGBO BITTERS Retail Liaison",
          email: "retail@kolaqalagbobitters.com",
          role: "viewer",
          status: "invited",
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          totalOrdersManaged: 12,
        },
      ],
      notifications: [
        {
          id: "notif-low-stock",
          title: "Low stock alert",
          message: "Emerald Reserve is below 10 bottles. Consider scheduling a new batch.",
          audience: "admin",
          severity: "warning",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: false,
        },
        {
          id: "notif-new-order",
          title: "Wholesale order",
          message: "Velvet Root Elixir – 24 bottle wholesale order awaiting confirmation.",
          audience: "admin",
          severity: "info",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          read: false,
        },
        {
          id: "notif-user",
          title: "Subscription reminder",
          message: "A reminder email was sent to returning customers for the Noir Botanica reserve.",
          audience: "user",
          severity: "info",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          read: true,
        },
      ],
      activity: [
        {
          id: "activity-seed",
          entityType: "system",
          summary: "Inventory system initialised",
          details: "Seed data loaded for products, users, and notifications.",
          createdAt: new Date().toISOString(),
          author: "System",
          severity: "info",
        },
      ],
    };
  }

  return {
    products: state.products ?? seedProducts,
    users: state.users ?? [],
    notifications: state.notifications ?? [],
    activity: state.activity ?? [],
  };
}

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.productId ? { ...product, ...action.payload } : product
        ),
      };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((product) => product.id !== action.productId) };
    case "ADD_USER":
      return { ...state, users: [action.payload, ...state.users] };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.userId ? { ...user, ...action.payload } : user)),
      };
    case "DELETE_USER":
      return { ...state, users: state.users.filter((user) => user.id !== action.userId) };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case "MARK_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.notificationId ? { ...notification, read: action.read } : notification
        ),
      };
    case "MARK_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
      };
    case "LOG_ACTIVITY":
      return { ...state, activity: [action.payload, ...state.activity].slice(0, 200) };
    default:
      return state;
  }
}

function loadState(): InventoryState {
  if (typeof window === "undefined") {
    return normalizeState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeState();
    const parsed = JSON.parse(raw) as InventoryState;
    return normalizeState(parsed);
  } catch (error) {
    console.warn("Failed to load inventory state", error);
    return normalizeState();
  }
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, undefined, loadState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const contextValue = useMemo(() => {
    const addProduct = async (input: ProductInput): Promise<Product> => {
      const baseSlug = input.slug ? slugify(input.slug) : slugify(input.name);
      const slug = baseSlug || generateId("product");

      try {
        // Create product via API
        const apiProduct = await productsApi.create({
          slug,
          name: input.name,
          description: input.description,
          image: input.image,
          category: input.category,
          size: input.size,
          isFeatured: input.isFeatured,
          prices: [
            { currency: 'NGN', amount: input.price.NGN },
            { currency: 'USD', amount: input.price.USD }
          ]
        });

        // Create local product object
        const product: Product = {
          id: apiProduct.id,
          slug: apiProduct.slug,
          name: input.name,
          description: input.description,
          price: input.price,
          sku: input.sku,
          stock: input.stock,
          isFeatured: input.isFeatured,
          image: input.image,
          tastingNotes: input.tastingNotes,
          category: input.category,
          size: input.size,
        };

        dispatch({ type: "ADD_PRODUCT", payload: product });
        dispatch({
          type: "LOG_ACTIVITY",
          payload: {
            id: generateId("activity"),
            entityType: "product",
            entityId: product.id,
            summary: `Product created: ${product.name}`,
            createdAt: new Date().toISOString(),
            author: "Admin",
            severity: "info",
          },
        });

        return product;
      } catch (error) {
        console.error('Failed to create product:', error);
        throw error;
      }
    };

    const updateProduct = async (productId: string, updates: Partial<Product>) => {
      const product = state.products.find((item) => item.id === productId);
      if (!product) return;

      try {
        // Prepare API update payload
        const apiUpdates: any = {};
        if (updates.name) apiUpdates.name = updates.name;
        if (updates.description) apiUpdates.description = updates.description;
        if (updates.image) apiUpdates.image = updates.image;
        if (updates.category) apiUpdates.category = updates.category;
        if (updates.size) apiUpdates.size = updates.size;
        if (updates.isFeatured !== undefined) apiUpdates.isFeatured = updates.isFeatured;
        if (updates.price) {
          apiUpdates.prices = [
            { currency: 'NGN', amount: updates.price.NGN },
            { currency: 'USD', amount: updates.price.USD }
          ];
        }

        // Update via API
        await productsApi.update(productId, apiUpdates);

        let slug = product.slug;
        if (updates.name && updates.name !== product.name) {
          const baseSlug = slugify(updates.name);
          slug = baseSlug;
        }

        dispatch({ type: "UPDATE_PRODUCT", productId, payload: { ...updates, slug } });
        dispatch({
          type: "LOG_ACTIVITY",
          payload: {
            id: generateId("activity"),
            entityType: "product",
            entityId: productId,
            summary: `Product updated: ${updates.name ?? product.name}`,
            details: `Fields changed: ${Object.keys(updates).join(", ") || "n/a"}`,
            createdAt: new Date().toISOString(),
            author: "Admin",
            severity: "info",
          },
        });
      } catch (error) {
        console.error('Failed to update product:', error);
        throw error;
      }
    };

    const deleteProduct = async (productId: string) => {
      const product = state.products.find((item) => item.id === productId);
      
      try {
        // Delete via API
        await productsApi.delete(productId);
        
        dispatch({ type: "DELETE_PRODUCT", productId });
        dispatch({
          type: "LOG_ACTIVITY",
          payload: {
            id: generateId("activity"),
            entityType: "product",
            entityId: productId,
            summary: `Product removed: ${product?.name ?? productId}`,
            createdAt: new Date().toISOString(),
            author: "Admin",
            severity: "warning",
          },
        });
      } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
      }
    };

    const addNotification = (
      input: Omit<AdminNotification, "id" | "createdAt" | "read">
    ): AdminNotification => {
      const notification: AdminNotification = {
        id: generateId("notif"),
        createdAt: new Date().toISOString(),
        read: false,
        ...input,
      };
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
      if (input.severity !== "info") {
        dispatch({
          type: "LOG_ACTIVITY",
          payload: {
            id: generateId("activity"),
            entityType: "system",
            entityId: notification.id,
            summary: `Notification sent: ${notification.title}`,
            details: notification.message,
            createdAt: notification.createdAt,
            author: "System",
            severity: notification.severity,
          },
        });
      }
      return notification;
    };

    const adjustStock = (productId: string, stock: number) => {
      dispatch({ type: "UPDATE_PRODUCT", productId, payload: { stock } });
      const product = state.products.find((item) => item.id === productId);
      dispatch({
        type: "LOG_ACTIVITY",
        payload: {
          id: generateId("activity"),
          entityType: "product",
          entityId: productId,
          summary: `Stock adjusted for ${product?.name ?? productId}`,
          details: `New stock level: ${stock}`,
          createdAt: new Date().toISOString(),
          author: "Admin",
          severity: stock < 10 ? "warning" : "info",
        },
      });
      if (stock < 10) {
        addNotification({
          title: "Low inventory warning",
          message: `${product?.name ?? "Product"} stock is now ${stock}.`,
          audience: "admin",
          severity: "warning",
        });
      }
    };

    const addUser = (input: Omit<AdminUser, "id">): AdminUser => {
      const user: AdminUser = { ...input, id: generateId("user") };
      dispatch({ type: "ADD_USER", payload: user });
      dispatch({
        type: "LOG_ACTIVITY",
        payload: {
          id: generateId("activity"),
          entityType: "user",
          entityId: user.id,
          summary: `User added: ${user.name}`,
          createdAt: new Date().toISOString(),
          author: "Admin",
          severity: "info",
        },
      });
      return user;
    };

    const updateUser = (userId: string, updates: Partial<AdminUser>) => {
      dispatch({ type: "UPDATE_USER", userId, payload: updates });
      dispatch({
        type: "LOG_ACTIVITY",
        payload: {
          id: generateId("activity"),
          entityType: "user",
          entityId: userId,
          summary: `User updated: ${updates.name ?? userId}`,
          details: `Fields changed: ${Object.keys(updates).join(", ") || "n/a"}`,
          createdAt: new Date().toISOString(),
          author: "Admin",
          severity: "info",
        },
      });
    };

    const deleteUser = (userId: string) => {
      const user = state.users.find((item) => item.id === userId);
      dispatch({ type: "DELETE_USER", userId });
      dispatch({
        type: "LOG_ACTIVITY",
        payload: {
          id: generateId("activity"),
          entityType: "user",
          entityId: userId,
          summary: `User removed: ${user?.name ?? userId}`,
          createdAt: new Date().toISOString(),
          author: "Admin",
          severity: "warning",
        },
      });
    };

    const markNotification = (notificationId: string, read = true) => {
      dispatch({ type: "MARK_NOTIFICATION", notificationId, read });
    };

    const markAllNotifications = () => {
      dispatch({ type: "MARK_ALL_NOTIFICATIONS" });
    };

    return {
      state,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addUser,
      updateUser,
      deleteUser,
      addNotification,
      markNotification,
      markAllNotifications,
    };
  }, [state]);

  return <InventoryContext.Provider value={contextValue}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}

export function useProducts() {
  return useInventory().state.products;
}

export function useAdminNotifications() {
  const { state, markNotification, markAllNotifications, addNotification } = useInventory();
  return {
    notifications: state.notifications,
    markNotification,
    markAllNotifications,
    addNotification,
  };
}

export function useAdminUsers() {
  const { state, addUser, updateUser, deleteUser } = useInventory();
  return {
    users: state.users,
    addUser,
    updateUser,
    deleteUser,
  };
}

export function useActivityLog(limit = 20) {
  const {
    state: { activity },
  } = useInventory();
  return activity.slice(0, limit);
}
