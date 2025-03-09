export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]bg-100 ">
      <h1>Welcome to SUARA</h1>
      
      <div className="card lg:card-side bg-base-300 shadow-sm">
        <figure>
          <img src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp" alt="Album" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">New album is released!</h2>
          <p>Click the button to listen on Spotiwhy app.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Listen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
