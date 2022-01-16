import React from 'react'
import { Navigate } from 'react-router-dom'
import { useLoadClientPrincipalQuery } from 'src/store/api/auth'
import { FullScreenLoading } from 'src/components/utilities/Loading'
import { useDispatch } from 'react-redux'
import { updateAccessToken } from 'src/store/features/auth'
import PropTypes from 'prop-types'

export const PrivateRoute = ({ children, routeType }) => {
  const dispatch = useDispatch()
  const { data: profile, error, isFetching } = useLoadClientPrincipalQuery()
  //console.log()
  if (isFetching) {
    return <FullScreenLoading />
  }

  dispatch(updateAccessToken(profile))

  const isAuthenticated = !!profile?.clientPrincipal && !error
  const isAdmin = profile?.clientPrincipal.userRoles.includes('admin')
  if (routeType === 'admin') {
    return !isAdmin ? <Navigate to="/403" /> : children
  } else {
    return !isAuthenticated ? <Navigate to="/login" /> : children
  }
}

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  routeType: PropTypes.string,
}
