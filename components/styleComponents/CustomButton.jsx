const CustomButton = ({ children, color = 'normal', ...otherProps }) => {
  const styles = {
    normal: 'bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border-2 border-blue-500 hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
  }

  return (
    <button className={`text-white font-bold py-2 px-4 rounded ${styles[color]}`} {...otherProps}>
      {children}
    </button>
  )
}

export default CustomButton
