export default function ButtonMaya ({ children, variant = 'blue', ...props }) {
  const variantColors = {
    green: 'text-lg hover:bg-green-400 bg-green-400 text-white font-bold py-1 px-4 border-b-4 border-green-700 hover:border-green-500 rounded mx-2',
    red: 'text-lg hover:bg-red-400 bg-red-400 text-white font-bold py-1 px-2 border-b-4 border-red-700 hover:border-red-500 rounded mx-2',
    blue: 'text-lg hover:bg-blue-400 bg-blue-400 text-white font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mx-2',
    gray: 'text-lg hover:bg-gray-400 bg-gray-400 text-white font-bold py-1 border-b-4 border-gray-700 hover:border-gray-500 rounded mx-2 px-4'
  }

  return (
    <button
      {...props}
      className={variantColors[variant]} >
     { children }
    </button>
  )
}
