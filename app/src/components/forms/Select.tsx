interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ value, onChange, options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      className={`h-9 rounded-md border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none ${className ?? ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}