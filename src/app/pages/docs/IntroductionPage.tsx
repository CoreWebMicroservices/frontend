import { DocsContent, CodeBlock, Callout } from '@/common/component/docs';

const IntroductionPage = () => {
  return (
    <DocsContent
      title="Introduction to Core Microservices"
      breadcrumbs={[
        { label: 'Documentation', path: '/docs/introduction' },
        { label: 'Introduction' },
      ]}
    >
      <p className="lead">
        Core Microservices is an enterprise-grade toolkit that provides production-ready backend services 
        and a modular frontend to help startups and development teams launch faster.
      </p>

      <h2 className="h3 mt-5 mb-3">What is Core Microservices?</h2>
      <p>
        Core Microservices (CoreMS) is a comprehensive platform that eliminates months of infrastructure 
        setup and boilerplate code. Instead of building authentication, user management, file storage, 
        and communication systems from scratch, you get battle-tested, production-ready services that 
        work together seamlessly.
      </p>

      <Callout type="tip" title="Perfect for">
        Startup founders, small development teams, solo developers, and anyone who wants to focus on 
        building unique business features instead of reinventing common infrastructure.
      </Callout>

      <h2 className="h3 mt-5 mb-3">Key Benefits</h2>
      
      <h3 className="h5 mt-4 mb-2">🚀 Launch Faster</h3>
      <p>
        Skip months of infrastructure development. Get authentication, user management, file storage, 
        and communication features working in minutes, not months.
      </p>

      <h3 className="h5 mt-4 mb-2">🏗️ Production-Ready Architecture</h3>
      <p>
        Built with enterprise patterns: microservices architecture, JWT authentication, role-based 
        access control, message queuing, and cloud-native deployment.
      </p>

      <h3 className="h5 mt-4 mb-2">🔧 Modular & Flexible</h3>
      <p>
        Use only what you need. Each service is independent and can be deployed separately. Add more 
        services as your application grows.
      </p>

      <h3 className="h5 mt-4 mb-2">💰 Free & Open Source</h3>
      <p>
        Licensed under Apache 2.0. Use it commercially without restrictions. No vendor lock-in, 
        no hidden costs.
      </p>

      <h2 className="h3 mt-5 mb-3">What's Included?</h2>
      
      <div className="row g-3 my-3">
        <div className="col-md-6">
          <div className="p-3 border rounded">
            <h4 className="h6 fw-bold">User Management Service</h4>
            <p className="small mb-0">
              Complete authentication with JWT, OAuth2 (Google, GitHub, LinkedIn), role-based access 
              control, and user profiles.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 border rounded">
            <h4 className="h6 fw-bold">Communication Service</h4>
            <p className="small mb-0">
              Multi-channel messaging: email, SMS, push notifications. Template management and 
              delivery tracking included.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 border rounded">
            <h4 className="h6 fw-bold">Document Service</h4>
            <p className="small mb-0">
              S3-compatible storage with MinIO. Upload, organize, and secure files with built-in 
              access control.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 border rounded">
            <h4 className="h6 fw-bold">Translation Service</h4>
            <p className="small mb-0">
              Multi-language support with translation management and dynamic content localization.
            </p>
          </div>
        </div>
      </div>

      <Callout type="info" title="Coming Soon">
        Payment processing, billing management, dynamic forms, template engine, and more services 
        are in active development.
      </Callout>

      <h2 className="h3 mt-5 mb-3">Technology Stack</h2>
      
      <h3 className="h5 mt-4 mb-2">Backend</h3>
      <ul>
        <li><strong>Java 25</strong> with <strong>Spring Boot 4.0</strong></li>
        <li><strong>PostgreSQL</strong> for data persistence</li>
        <li><strong>RabbitMQ</strong> for message queuing</li>
        <li><strong>Docker</strong> for containerization</li>
        <li><strong>JWT</strong> for authentication</li>
      </ul>

      <h3 className="h5 mt-4 mb-2">Frontend</h3>
      <ul>
        <li><strong>React 18+</strong> with <strong>TypeScript</strong></li>
        <li><strong>Vite</strong> for fast development</li>
        <li><strong>React Bootstrap</strong> for UI components</li>
        <li><strong>React Router</strong> for navigation</li>
        <li>Modular architecture for easy customization</li>
      </ul>

      <h3 className="h5 mt-4 mb-2">DevOps</h3>
      <ul>
        <li><strong>Docker Compose</strong> for local development</li>
        <li><strong>GitHub Actions</strong> for CI/CD</li>
        <li><strong>Terraform</strong> for infrastructure as code</li>
        <li><strong>Kubernetes</strong> ready for cloud deployment</li>
      </ul>

      <h2 className="h3 mt-5 mb-3">Quick Example</h2>
      <p>Get the entire stack running in minutes:</p>

      <CodeBlock language="bash">
{`# Clone the repository
git clone https://github.com/CoreWebMicroservices/corems-project.git
cd corems-project

# Initialize all services
./setup.sh init-all

# Start infrastructure (PostgreSQL, RabbitMQ, MinIO)
./setup.sh infra

# Build all services
./setup.sh build all

# Run migrations
./setup.sh migrate --mockdata

# Start all services
./setup.sh start-all`}
      </CodeBlock>

      <p className="mt-3">
        That's it! Your entire microservices platform is now running with sample data.
      </p>

      <Callout type="tip" title="Next Steps">
        Check out the <a href="/docs/quick-start">Quick Start Guide</a> for detailed setup instructions, 
        or explore the <a href="/docs/architecture">Architecture Overview</a> to understand how everything 
        works together.
      </Callout>
    </DocsContent>
  );
};

export default IntroductionPage;
