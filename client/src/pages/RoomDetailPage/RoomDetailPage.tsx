import { Layout, Grid } from "antd";
import AuthenticatedLayout from "@/components/templates/AuthenticatedLayout";
import { useParams } from "umi";

import './RoomDetailPage.module.css'
import RoomDetailPageMessageInput from "@/components/organisms/RoomDetailPageMessageInput";
import RoomDetailPageMessageView from "@/components/organisms/RoomDetailPageMessageView";
import RoomDetailPageMemberList from "@/components/organisms/RoomDetailPageMemberList";

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const RoomDetailPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
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
            <h1 className="RoomDetailPage__title">Room {roomId}</h1>
          </Header>
          <Content className="flex flex-col flex-grow-1">
            {/* Chat Container */}
            <RoomDetailPageMessageView />
            {/* Input */}
            <RoomDetailPageMessageInput />
          </Content>
          {/* </Layout> */}
        </Content>

        {screens.lg ? (
          <Sider>
            <RoomDetailPageMemberList></RoomDetailPageMemberList>
          </Sider>
        ) : null}
      </Layout>
    </AuthenticatedLayout>
  );
}

export default RoomDetailPage;