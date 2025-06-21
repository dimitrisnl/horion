export const FocusedLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {children}
    </div>
  );
};
