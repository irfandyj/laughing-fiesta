import { Layout } from "antd";
import AuthenticatedLayout from "@/components/templates/AuthenticatedLayout";
import { useParams } from "umi";

const { Header, Content } = Layout;

const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  // const { data, isLoading } = useRoomDetail(id);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!data) {
  //   return <div>Room not found</div>;
  // }

  return (
    <AuthenticatedLayout>
      <Layout className="h-full">
        <Header style={{ 'background': gray[8] }}>
          <h1 className="text-primary">Room {id}</h1>
        </Header>
        <Content>
          {/* <h1>{data.name}</h1>
            <p>{data.description}</p> */}
        </Content>
      </Layout>
    </AuthenticatedLayout>
  );
}

export default RoomDetailPage;