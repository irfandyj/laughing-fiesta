import { Layout, Grid } from "antd";
import AuthenticatedLayout from "@/components/templates/AuthenticatedLayout";
import { useParams } from "umi";

import './RoomDetailPage.module.css'
import RoomDetailPageMessageInput from "@/components/organisms/RoomDetailPageMessageInput";
import RoomDetailPageMessageView from "@/components/organisms/RoomDetailPageMessageView";

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const screens = useBreakpoint();
  // const { data, isLoading } = useRoomDetail(id);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!data) {
  //   return <div>Room not found</div>;
  // }

  return (
    <AuthenticatedLayout>
      <Layout className="RoomDetailPage">
        <Content className="flex flex-col">
          {/* <Layout> */}
          <Header>
            <h1 className="RoomDetailPage__title">Room {id}</h1>
          </Header>
          <Content className="flex flex-col flex-grow-1">
            {/* Chat Container */}
            <div className="flex-grow-1">
              <RoomDetailPageMessageView />
            </div>
            {/* Input */}
            <RoomDetailPageMessageInput />
          </Content>
          {/* </Layout> */}
        </Content>

        {screens.lg ? (
          <Sider>
            <h1>Members</h1>
            <ul>
              <li>Member 1</li>
              <li>Member 2</li>
              <li>Member 3</li>
            </ul>
          </Sider>
        ) : null}
      </Layout>
    </AuthenticatedLayout>
  );
}

export default RoomDetailPage;