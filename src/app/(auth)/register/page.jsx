import Register from '@views/Register'
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Register',
  description: 'Register a new account'
}

const RegisterPage = () => {
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default RegisterPage
