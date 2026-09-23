import { useContext } from 'react'

import NotificationContext from './NotificationContext'

export const useNotify = () => {
  const [, notify] = useContext(NotificationContext)

  return notify
}

export const useNotification = () => {
  const [notification] = useContext(NotificationContext)

  return notification
}
