var PostArchive = React.createClass({
  render: function () {
    return (
      <div class="postbox">
        <h3>{this.props.title}</h3>
      </div>
    );
  }
});

React.render(<PostArchive title="This is title" />, document.getElementById('nubs-body'));
