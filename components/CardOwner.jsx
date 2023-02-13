export default function CardOwner ({ owner }) {
  const setOwnerData = () => {
    localStorage.setItem('owner', JSON.stringify(owner._id))
  }

  return (
    <div
    onClick={() => setOwnerData()}
    className="h-[120px] w-[279px] px-4 cursor-pointer text-gray-800 flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 hover:bg-[#C7F9CC]">
      <h1 className="text-2xl font-bold">{owner.name}</h1>
      <p className="text-gray-500">{owner.razonSocial}</p>
    </div>
  )
}
