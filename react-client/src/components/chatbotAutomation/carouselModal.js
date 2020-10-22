/* eslint-disable no-undef */
import React from 'react'
import CarouselCard from './carouselCard'
import {deleteFile} from '../../utility/utils'
import CONFIRMATIONMODAL from '../extras/confirmationModal'

class CarouselModal extends React.Component {
  constructor(props) {
    super(props)
    this.cardLimit = 10
    this.initialCarouselCards = [{
      fileurl: null,
      image_url: '',
      title: '',
      buttons: [],
      subtitle: ''
    }]
    this.state = {
      cards: this.props.cards ? JSON.parse(JSON.stringify(this.props.cards)) : JSON.parse(JSON.stringify(this.initialCarouselCards)),
      edited: false,
      selectedIndex: 0
    }

    this.carouselIndicatorStyle = {
      textIndent: '0',
      margin: '0 2px',
      width: '20px',
      height: '20px',
      border: 'none',
      borderRadius: '100%',
      lineHeight: '20px',
      color: '#fff',
      backgroundColor: '#999',
      transition: 'all 0.25s ease'
    }
    this.carouselIndicatorActiveStyle = {
      width: '25px',
      height: '25px',
      lineHeight: '25px',
      backgroundColor: '#337ab7'
    }

    this.updateCard = this.updateCard.bind(this)
    this.addCard = this.addCard.bind(this)
    this.removeCard = this.removeCard.bind(this)
    this.updateSelectedIndex = this.updateSelectedIndex.bind(this)
    this.getRequirements = this.getRequirements.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleDone = this.handleDone.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.cards) {
      this.setState({cards: JSON.parse(JSON.stringify(nextProps.cards))})
    } else {
      this.setState({cards: JSON.parse(JSON.stringify(this.initialCarouselCards))})
    }
  }

  toggleHover(index, hover) {
    this.setState({ hover: hover ? index : -1 })
  }

  componentDidMount() {
    console.log('componentDidMount CardModal props', this.props)
    //Improve Later
    let that = this
    $('#carouselControls').on('slide.bs.carousel', function (e) {
      var active = $(e.target).find('.carousel-inner > .carousel-item.active');
      var from = active.index();
      var next = $(e.relatedTarget);
      var to = next.index();
      console.log(from + ' => ' + to);
      that.setState({ selectedIndex: to })
    })
  }

  updateCard (index, card, callback) {
    let cards = this.state.cards
    cards[index] = card
    this.setState({cards, error: '', edited: true}, () => {
      if (callback) {
        callback()
      }
    })
  }

  addCard () {
    let cards = this.state.cards
    cards.push({
        fileurl: null,
        image_url: '',
        title: '',
        buttons: [],
        subtitle: ''
    })
    this.setState({cards, selectedIndex: cards.length - 1, error: '', edited: true})
  }

  removeCard (index) {
    let cards = this.state.cards
    if (cards.length === 1) {
      this.setState({error: '*At least one card is required'})
    } else {
      cards.splice(index, 1)
      this.setState({cards, error: '', selectedIndex: index < cards.length ? index : index - 1, edited: true})
    }
  }

  updateSelectedIndex (index) {
    this.setState({selectedIndex: index})
  }

  getRequirements () {
    return this.state.cards.map((card, index) => {
        let requirements = []
        let msg = `Card ${index + 1} requires:`
        if (!card.title) {
          requirements.push('a title')
        }
        if (requirements.length > 0) {
          return (
            <li style={{ textAlign: 'left', marginLeft: '75px', color: 'red' }}>{msg}
              <ul>
                {requirements.map(req => <li>{req}</li>)}
              </ul>
            </li>
          )
        }
    }).filter(c => !!c)
  }

  handleDone () {
    this.props.updateParentState({carouselCards: this.state.cards, selectedComponent: 'carousel'})
    this.closeModal(true, false)
  }

  updateCards (cards) {
    this.setState({cards})
  }

  closeModal (force, reinitialize) {
    if (force || !this.state.edited) {
      if (reinitialize) {
        this.setState({
          cards: this.props.cards ? JSON.parse(JSON.stringify(this.props.cards)) : JSON.parse(JSON.stringify(this.initialCarouselCards)), 
          edited: false, 
          error : '', 
          selectedIndex: 0
        }, () => {
          this.closeModalTrigger.click()
        })
      } else {
        this.setState({edited: false, error : '', selectedIndex: 0}, () => {
          this.closeModalTrigger.click()
        })
      }
    } else {
      this.closeModalConfirm.click()
    }
  }

  render() {
    let requirements = this.getRequirements()

    return (
      <>
        <button style={{display: 'none'}} ref={(el) => this.closeModalConfirm = el} data-toggle='modal' data-target='#_close_carousel_modal_confirm' />
        <CONFIRMATIONMODAL
          id='_close_carousel_modal_confirm'
          title='Warning'
          description='Are you sure you want to exit? You will lose any data inputted.'
          onConfirm={() => this.closeModal(true, true)}
          zIndex={1051}
        />
        <div
          style={{ background: "rgba(33, 37, 41, 0.6)", zIndex: 1050 }}
          className="modal fade"
          id={this.props.id}
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            style={{ transform: "translate(0, 0)", marginLeft: '13pc' }}
            className="modal-dialog"
            role="document"
          >
            <button
              ref={(el) => this.closeModalTrigger = el}
              style={{ display: 'none' }}
              data-dismiss="modal"
            > </button>
            <div className="modal-content" style={{width: '72vw'}}>
              <div style={{ display: "block" }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {this.props.title}
                </h5>
                  <button
                    id={`_close${this.props.id}`}
                    onClick={() => this.closeModal(false)}
                    style={{ marginTop: "-10px", opacity: "0.5", color: "black" }}
                    type="button"
                    className="close"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div style={{ color: "black" }} className="modal-body">
                <div>
                  <div className="row">
                    <div className="col-6">
                      <div
                        id="cardsContainer"
                        style={{ maxHeight: "55vh", overflowY: "scroll" }}
                      >
                        <div className="panel-group" id="accordion">
                          <div style={{ color: "red" }}>{this.state.error}</div>
                          <div className="panel panel-default">
                            <div className="panel-heading">
                              <h4 className="panel-title" style={{ fontSize: "22px" }}>
                                <span>Card #{this.state.selectedIndex + 1}</span>
                                <div
                                  onClick={() =>
                                    this.removeCard(this.state.selectedIndex)
                                  }
                                  style={{
                                    marginLeft: "95%",
                                    marginTop: "-23px",
                                    cursor: "pointer",
                                  }}
                                >
                                <i style={{
                                    cursor: 'pointer',
                                    zIndex: '1',
                                    fontSize: '1.5rem'
                                    }} 
                                    className="flaticon-circle" 
                                    onClick={this.props.onRemove}
                                />
                                </div>
                              </h4>
                            </div>
                            <div>
                              <div className="panel-body">
                                <CarouselCard
                                  chatbot={this.props.chatbot}
                                  uploadAttachment={this.props.uploadAttachment}
                                  index={this.state.selectedIndex}
                                  card={this.state.cards[this.state.selectedIndex]}
                                  updateCard={this.updateCard}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: "20px" }}>
                        {this.state.cards.length < this.cardLimit && (
                          <div
                            onClick={this.addCard}
                            className="ui-block hoverborder"
                            style={{
                              minHeight: "30px",
                              width: "100%",
                              marginLeft: "0px",
                              marginBottom: "30px",
                            }}
                          >
                            <div style={{ paddingTop: "5px" }} className="align-center">
                              <h6> + Add Card </h6>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-1">
                      <div
                        style={{
                          minHeight: "100%",
                          width: "1px",
                          borderLeft: "1px solid rgba(0,0,0,.1)",
                        }}
                      />
                    </div>
                    <div className="col-5">
                      <h4 style={{ marginLeft: "-50px" }}>Preview:</h4>
                      <div
                        className="ui-block"
                        style={{
                          overflowY: "auto",
                          border: "1px solid rgba(0,0,0,.1)",
                          borderRadius: "3px",
                          maxHeight: "68vh",
                          minHeight: "68vh",
                          marginLeft: "-50px",
                        }}
                      >
                        <div
                          id="carouselControls"
                          data-interval="false"
                          className="carousel slide ui-block"
                          data-ride="carousel"
                        >
                          {this.state.cards.length > 1 && (
                            <ol
                              className="carousel-indicators carousel-indicators-numbers"
                              style={{ bottom: "-65px" }}
                            >
                              {this.state.cards.map((card, index) => {
                                return (
                                  <li
                                    style={
                                      this.state.hover === index ||
                                      this.state.selectedIndex === index
                                        ? {
                                            ...this.carouselIndicatorStyle,
                                            ...this.carouselIndicatorActiveStyle,
                                          }
                                        : this.carouselIndicatorStyle
                                    }
                                    onMouseEnter={() => this.toggleHover(index, true)}
                                    onMouseLeave={() => this.toggleHover(index, false)}
                                    data-target="#carouselControls"
                                    // data-slide-to={index}
                                    onClick={() => this.updateSelectedIndex(index)}
                                    className={
                                      index === this.state.selectedIndex ? "active" : ""
                                    }
                                  >
                                    {index + 1}
                                  </li>
                                );
                              })}
                            </ol>
                          )}
                          <div className="carousel-inner">
                            {this.state.cards.map((card, index) => {
                              console.log("cards carousel inner", card);
                              return (
                                <div
                                  style={{
                                    border: "1px solid rgba(0,0,0,.1)",
                                    borderRadius: "10px",
                                    minHeight: "200px",
                                    maxWidth: "250px",
                                    margin: "auto",
                                    marginTop: "60px",
                                  }}
                                  className={
                                    "carousel-item " +
                                    (index === this.state.selectedIndex
                                      ? "active"
                                      : "") +
                                    (index === this.state.selectedIndex + 1
                                      ? "next"
                                      : "") +
                                    (index === this.state.selectedIndex - 1
                                      ? "prev"
                                      : "")
                                  }
                                >
                                  {card.image_url && (
                                    <img
                                      alt=""
                                      src={card.image_url}
                                      style={{
                                        objectFit: "cover",
                                        minHeight: "170px",
                                        maxHeight: "170px",
                                        maxWidth: "300px",
                                        paddingBottom: "11px",
                                        paddingTop: "29px",
                                        margin: "-25px",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                  )}
                                  <hr
                                    style={{
                                      marginTop: card.image_url ? "" : "100px",
                                      marginBottom: "5px",
                                    }}
                                  />
                                  <h6
                                    style={{
                                      textAlign: "justify",
                                      marginLeft: "10px",
                                      marginTop: "10px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {card.title}
                                  </h6>
                                  <p
                                    style={{
                                      textAlign: "justify",
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {card.subtitle}
                                  </p>
                                  {card.buttons.map((button, index) => (
                                    <div>
                                      <hr
                                        style={{
                                          marginTop:
                                            !card.title && !card.subtitle && index === 0
                                              ? "50px"
                                              : "",
                                        }}
                                      />
                                      <h5 style={{ color: "#0782FF" }}>
                                        {button.title}
                                      </h5>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                          {this.state.cards.length > 1 && (
                            <div>
                              {this.state.selectedIndex > 0 && (
                                <span
                                  onClick={(e) =>
                                    this.updateSelectedIndex(
                                      this.state.selectedIndex - 1
                                    )
                                  }
                                  className="carousel-control-prev"
                                  style={{ top: "125px" }}
                                  role="button"
                                >
                                  <span
                                    className="carousel-control-prev-icon"
                                    style={{
                                      cursor: "pointer",
                                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`,
                                    }}
                                    aria-hidden="true"
                                  ></span>
                                  <span className="sr-only">Previous</span>
                                </span>
                              )}
                              {this.state.selectedIndex <
                                this.state.cards.length - 1 && (
                                <span
                                  onClick={(e) =>
                                    this.updateSelectedIndex(
                                      this.state.selectedIndex + 1
                                    )
                                  }
                                  className="carousel-control-next"
                                  style={{ top: "125px" }}
                                  role="button"
                                >
                                  <span
                                    className="carousel-control-next-icon"
                                    style={{
                                      cursor: "pointer",
                                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`,
                                    }}
                                    aria-hidden="true"
                                  ></span>
                                  <span className="sr-only">Next</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <ul style={{ marginTop: "65px" }}>
                          {requirements && requirements.length > 0 ? (
                            requirements
                          ) : (
                            <li
                              style={{
                                textAlign: "left",
                                color: "green",
                                marginLeft: "30px",
                              }}
                            >
                              {"All requirments fulfilled"}
                              <ul>
                                <li>Click on Add Card to add additional cards</li>
                                <li>Click the Next button to finish</li>
                              </ul>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-6" style={{ marginTop: "-5vh" }}>
                    <div className="pull-right">
                      <button
                        onClick={() => this.closeModal(false)}
                        className="btn btn-primary"
                        style={{ marginRight: "20px" }}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={requirements && requirements.length > 0}
                        onClick={this.handleDone}
                        className="btn btn-primary"
                      >
                        {this.props.edit ? "Edit" : "Next"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default CarouselModal
