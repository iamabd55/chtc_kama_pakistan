/**
 * COMPONENT MEMOIZATION PATTERNS
 * 
 * Common patterns and best practices for memoizing components
 * throughout the CHTC Kama Pakistan website.
 */

// ============================================================
// PATTERN 1: Basic Component Memoization
// ============================================================

import { memo, useCallback, useMemo } from "react";

/**
 * Pattern 1: Simple memo for presentational components
 * Use when component re-renders with same props frequently
 */
export const PresentationalComponent = memo(
  ({ title, description }: { title: string; description: string }) => (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
  (prevProps, nextProps) => prevProps.title === nextProps.title && prevProps.description === nextProps.description
);

// ============================================================
// PATTERN 2: Component with Callbacks
// ============================================================

/**
 * Pattern 2: Component with memoized callbacks
 * Use when component needs to pass callbacks to children
 */
interface ListItemProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const ListItem = memo(({ id, name, onDelete, onEdit }: ListItemProps) => (
  <div>
    <span>{name}</span>
    <button onClick={() => onDelete(id)}>Delete</button>
    <button onClick={() => onEdit(id)}>Edit</button>
  </div>
));

/**
 * Parent component that uses ListItem
 * Must memoize callbacks to prevent child re-renders
 */
interface ListProps {
  items: { id: string; name: string }[];
}

export const List = memo(({ items }: ListProps) => {
  const handleDelete = useCallback((id: string) => {
    console.log("Delete:", id);
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log("Edit:", id);
  }, []);

  return (
    <div>
      {items.map((item) => (
        <ListItem
          key={item.id}
          id={item.id}
          name={item.name}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
});

// ============================================================
// PATTERN 3: Component with Complex State
// ============================================================

/**
 * Pattern 3: Memoize complex computations
 * Use when component depends on expensive calculations
 */
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductListProps {
  products: Product[];
  discountPercentage: number;
}

export const ProductList = memo(({ products, discountPercentage }: ProductListProps) => {
  // Memoize expensive calculation
  const totalPrice = useMemo(() => {
    return products.reduce((sum, product) => {
      const discountedPrice = product.price * (1 - discountPercentage / 100);
      return sum + discountedPrice * product.quantity;
    }, 0);
  }, [products, discountPercentage]);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <span>{product.name}</span>
          <span>${product.price}</span>
          <span>Qty: {product.quantity}</span>
        </div>
      ))}
      <div>Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
});

// ============================================================
// PATTERN 4: HOC for Memoization
// ============================================================

/**
 * Pattern 4: Higher-Order Component wrapper
 * Useful for applying memoization consistently
 */
export function withMemoization<P extends object>(
  Component: React.FC<P>,
  compareFunction?: (prev: P, next: P) => boolean
) {
  return memo(Component, compareFunction);
}

// ============================================================
// PATTERN 5: Selectors with Memoization
// ============================================================

/**
 * Pattern 5: Memoized selectors for derived data
 * Useful in Redux-like state management
 */
import { useMemo as useMemoDep } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserListProps {
  users: User[];
  filterRole?: string;
}

export const UserList = memo(({ users, filterRole }: UserListProps) => {
  // Memoize filtered users
  const filteredUsers = useMemoDep(() => {
    if (!filterRole) return users;
    return users.filter((user) => user.role === filterRole);
  }, [users, filterRole]);

  return (
    <div>
      {filteredUsers.map((user) => (
        <div key={user.id}>
          <div>{user.name}</div>
          <div>{user.email}</div>
          <div>{user.role}</div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// PATTERN 6: Conditional Memoization
// ============================================================

/**
 * Pattern 6: When to memo and when not to
 * 
 * ✅ MEMO THESE:
 *    - Components that receive many props
 *    - Components that re-render often due to parent updates
 *    - Expensive components (lots of DOM nodes)
 *    - Components with complex logic
 * 
 * ❌ DON'T MEMO THESE:
 *    - Simple components with few props
 *    - Components that rarely re-render
 *    - Components with simple UI
 *    - Components that receive inline objects/arrays
 */

// ============================================================
// PATTERN 7: Application in Real Components
// ============================================================

/**
 * EXAMPLE: Applying patterns to actual components
 */

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const DashboardCard = memo(
  ({ title, value, icon, onClick }: DashboardCardProps) => (
    <div className="dashboard-card" onClick={onClick}>
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p className="value">{value}</p>
    </div>
  ),
  (prev, next) => {
    // Custom comparison: only re-render if title or value changes
    return prev.title === next.title && prev.value === next.value;
  }
);

// Dashboard with memoized callbacks
export const Dashboard = memo(() => {
  const handleCardClick = useCallback((cardId: string) => {
    console.log("Card clicked:", cardId);
    // Navigate to detail page
  }, []);

  const stats = useMemo(
    () => [
      { id: "1", title: "Total Products", value: 150 },
      { id: "2", title: "Active Dealers", value: 45 },
      { id: "3", title: "Total Sales", value: "$1.2M" },
    ],
    []
  );

  return (
    <div className="dashboard">
      {stats.map((stat) => (
        <DashboardCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={<div />}
          onClick={() => handleCardClick(stat.id)}
        />
      ))}
    </div>
  );
});

// ============================================================
// PATTERN 8: Performance Monitoring
// ============================================================

/**
 * Pattern 8: Debug component renders in development
 */
export function withRenderTracking<P extends object>(
  Component: React.FC<P>,
  componentName: string
) {
  const TrackedComponent = (props: P) => {
    useMemoDep(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[RENDER] ${componentName}`);
      }
    }, []);

    return <Component {...props} />;
  };

  return memo(TrackedComponent);
}

// Use it:
// export const MyComponent = withRenderTracking(MyComponent, "MyComponent");

export default "Import patterns from this file and apply to your components";
