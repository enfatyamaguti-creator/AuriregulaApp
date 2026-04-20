interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper de conteúdo: padding responsivo + centralizado no desktop.
 * Usar abaixo do AppHeader em todas as páginas.
 */
export default function PageContent({ children, className = '' }: Props) {
  return (
    <div className={`px-4 md:px-8 py-4 md:py-6 w-full max-w-4xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
