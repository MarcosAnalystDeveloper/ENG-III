import './Button.css';

/**
 * Botão genérico com variantes. Reutilizado em todo o app para manter
 * consistência visual sem repetir CSS (princípio DRY / componentização).
 */
export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger
  size = 'md', // sm | md | lg
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
