import AuthenticatedLayout from '@/components/templates/AuthenticatedLayout';
import './HomePage.module.css';

const App: React.FC = (props) => {
  return (
    <AuthenticatedLayout>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        Welcome, You!
      </div>
    </AuthenticatedLayout>
  );
}

export default App;