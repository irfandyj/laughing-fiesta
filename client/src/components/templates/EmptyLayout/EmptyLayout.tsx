const EmptyLayout: React.FC = (props) => {
  const { children } = props;
  return (
    <div className='EmptyLayout'>
      {children}
    </div>
  );
}

export default EmptyLayout;