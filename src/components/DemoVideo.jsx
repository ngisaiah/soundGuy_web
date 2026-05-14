export default function DemoVideo() {
  return (
    <section id="demo" className="py-24">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Watch it work</p>
          <h2 className="section-heading">See SoundGuy in Action</h2>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl overflow-hidden border border-border-soft shadow-lg">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/9ZY6YMx8tBw"
              title="SoundGuy demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
