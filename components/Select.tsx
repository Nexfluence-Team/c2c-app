"use client"

type SelectProps = {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
}

export default function Select({
  value,
  onChange,
  options,
  placeholder
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-3 rounded-xl
                 bg-purple-900/30 text-purple-100
                 border border-purple-400/30
                 outline-none focus:bg-purple-900/50 transition"
    >
      <option value="">{placeholder}</option>

      {options.map(option => (
        <option
          key={option}
          value={option}
          className="text-black"
        >
          {option}
        </option>
      ))}
    </select>
  )
}
