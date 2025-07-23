import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'

const AdminPermision = ({children}) => {
    const user = useSelector(state => state.user)


  return (
    <>
        {
            isAdmin(user.role) ?  children : <p className='text-red-600 bg-red-100 p-4'>Do not have permission</p>
        }
    </>
  )
}
AdminPermision.propTypes = {
    children: PropTypes.node
}

export default AdminPermision