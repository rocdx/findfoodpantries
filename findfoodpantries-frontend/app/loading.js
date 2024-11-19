export default function Loading(props) {
  const { loadingDescritpion } = props
  return (
    <div className="">
      <div className="flex flex-col gap-8 justify-center items-center pt-14">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
        <h3 className="text-lg font-normal text-gray-900">
          {loadingDescritpion}
        </h3>
      </div>
    </div>
  )
}
