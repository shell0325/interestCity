export default function ({ $auth, redirect, }) {

  if (!$auth.strategy.token.status().valid()) {
    return redirect('/login')
  }
}
