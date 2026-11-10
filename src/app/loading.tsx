/** Shown while a route segment loads. Routes are static, so this appears only briefly. */
export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="loader-ring" />
      <span>LOADING</span>
    </div>
  );
}
