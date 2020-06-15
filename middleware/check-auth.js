export default function ({
  isHMR,
  route,
  redirect,
  to
}) {
  if (isHMR) return
  if (route.fullPath == '/') {
    return redirect('/databoard')
  }

}
