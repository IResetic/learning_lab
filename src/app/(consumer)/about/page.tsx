export default function AboutPage() {
  return (
    <div className="container max-w-4xl my-8">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            About Learning Lab
          </h1>
        </header>
        
        <div className="space-y-6">
          <p className="text-xl text-muted-foreground leading-relaxed">
            Welcome to Learning Lab, a platform dedicated to sharing knowledge and fostering continuous learning.
          </p>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">Our Mission</h2>
            <p>
              We believe that learning should be accessible, engaging, and continuous. Our platform provides 
              a space where knowledge can be shared, discussed, and explored by learners of all backgrounds.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">What We Offer</h2>
            <ul className="space-y-2">
              <li>• Curated articles on various topics</li>
              <li>• In-depth tutorials and guides</li>
              <li>• Expert insights and analysis</li>
              <li>• A community-driven learning experience</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">Get Started</h2>
            <p>
              Explore our articles, engage with the content, and join our community of learners. 
              Whether you're looking to expand your knowledge or share your expertise, 
              Learning Lab is here to support your educational journey.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}