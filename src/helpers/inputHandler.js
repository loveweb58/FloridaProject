export default component => {
  return {
    normal: name => {
      return e =>
        component.setState({
          ...component.state,
          [name]: e.target.value
        });
    }
  };
};
