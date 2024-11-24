
const ModalSkeleton = ({ show, outsideClick, children, bgClass, modalStyle, padding = true, mobileFullScreen = false, title }) => {
  let classAdd = show
    ? "modal-transition-show opacity-100"
    : "modal-transition-hide opacity-0"

  return (
    <>
      <div
        onClick={outsideClick}
        className={"fixed inset-0 bg-modalBackground z-50 " + (mobileFullScreen ? "lg:block hidden " : "") + classAdd}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={modalStyle}
          className={
            "absolute max-h-[85vh] overflow-y-auto lg:w-[600px] max-w-full rounded-2xl m-auto top-32 inset-x-2 " +
            (bgClass ? bgClass : "bg-card ") +
            (padding ? " p-3 lg:p-6 " : "")
          }
        >
          {children}
        </div>
      </div>
      <div className={"w-full lg:hidden z-50 bg-white h-[100svh] lg:h-screen " + (mobileFullScreen ? "fixed top-0 " : "hidden ") + classAdd}>
        <div className="text-center relative py-4 border-b border-mat">
          {title ? title : ""}
        </div>
        <div className="py-4 h-[calc(100%-57px)]">
          {children}
        </div>
      </div>
    </>
  )
}

export default ModalSkeleton
