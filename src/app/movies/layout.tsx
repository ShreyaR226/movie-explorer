import ProtectedRoute from '@/components/ProtectedRoute';

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}