import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { IoClose } from "react-icons/io5"

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }

    // Close dialog on ESC key or outside click (optional)
    const handleCancel = (e) => {
      if (e.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', handleCancel)
    return () => window.removeEventListener('keydown', handleCancel)
  }, [close])

  // Prevent closing dialog by clicking outside — optional:
  const onClickBackdrop = (e) => {
    if (e.target === dialogRef.current) {
      close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={onClickBackdrop}
      className="p-0 rounded max-w-md w-full"
      aria-labelledby="add-field-title"
    >
      <div className="bg-white rounded p-4">
        <div className="flex items-center justify-between gap-3">
          <h1 id="add-field-title" className="font-semibold">
            Add Field
          </h1>
          <button
            onClick={close}
            aria-label="Close add field modal"
            type="button"
          >
            <IoClose size={25} />
          </button>
        </div>
        <input
          className="bg-blue-50 my-3 p-2 border outline-none focus-within:border-primary-100 rounded w-full"
          placeholder="Enter field name"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
          autoFocus
          aria-required="true"
          type="text"
          name="fieldName"
          id="fieldName"
        />
        <button
          onClick={submit}
          className="bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded mx-auto w-fit block"
          type="button"
        >
          Add Field
        </button>
      </div>
    </dialog>
  )
}

AddFieldComponent.propTypes = {
  close: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
}

export default AddFieldComponent