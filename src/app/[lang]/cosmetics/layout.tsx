export default async function CosmeticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* children に dict を渡す方法を検討 */}
      {/* 現状は children をそのままレンダリングし、子コンポーネントで dict を受け取るようにする */}
      {children}
    </>
  );
}
