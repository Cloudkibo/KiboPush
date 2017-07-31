import React from 'react';
import Popover from 'react-simple-popover';

class Response extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopover: false
    };
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  openPopover() {
    this.setState({ showPopover: true });
  }

  closePopover() {
    this.setState({ showPopover: false });
  }

  render() {
    const response = this.props.responses.responses.filter((c) => c.questionId._id == this.props.question._id);
    console.log(response);
    return (
      (
        this.props.question.type === 'text' ?
          <ul className='list-group'>
            {
              response.map((c) => (
                <div>
                <li
                  className='list-group-item'
                  style={{ cursor: 'pointer' }}
                  key={c._id}
                  ref='target'
                  onMouseOver={this.openPopover}
                  onMouseOut={this.closePopover}
                >
                  {c.response}
                </li>
                <Popover
                  placement='top'
                  container={this}
                  target={this.refs.target}
                  show={this.state.showPopover}
                  onHide={this.closePopover}
                >
                  <div>
                    <div style={{ display: 'inline-block' }}>
                      <img
                        style={{ width: '75', height: '75', marginBottom: '60' }}
                        src={'./img/man.png'}
                        alt="user"
                        className="img-responsive"
                      />
                    </div>
                    <div style={{ display: 'inline-block', width: '75', margin: '5' }}>
                      <h5> Customer Name </h5>
                        <p> Some info </p>
                    </div>
                  </div>
                </Popover>
                </div>
              ))
            }
          </ul>
        :
        <div className="chart-js chart-js-one-bar">
          <canvas id="poll-bar-chart" width={1400} height={380} />
        </div>
      )
    );
  }
}

export default Response;
