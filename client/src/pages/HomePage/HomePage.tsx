import AuthenticatedLayout from '@/components/templates/AuthenticatedLayout';
import './HomePage.module.css';
import { connect } from 'umi';
import { ProfileModelState } from '@/models/profile/profile.types';

interface HomePageProps {
  profile: ProfileModelState
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { profile } = props;

  return (
    <AuthenticatedLayout>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        Welcome, You, {profile.currentChosenUsername}!
      </div>
    </AuthenticatedLayout>
  );
}

export default connect(({ profile }: { profile: ProfileModelState }) => {
  return { profile }
})(HomePage)
