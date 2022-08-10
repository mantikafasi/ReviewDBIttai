import { stores } from 'ittai';
import { findByDisplayName, findByProps, ModalActions } from 'ittai/webpack';
import React, { Component } from 'react'
import { Review } from '../entities/Review';
import { deleteReview, reportReview } from '../Utils/ReviewDBAPI';
import { showToast, sleep } from '../Utils/Utils';
import MessageButton from './MessageButton';
import { Queue } from './ReviewsView';

const { cozyMessage, buttons } = findByProps("cozyMessage")
const { container, isHeader } = findByProps("container", "isHeader")
const { avatar, clickable } = findByProps("avatar", "zalgo")
const { username } = findByProps("header", "zalgo")
const { messageContent } = findByProps("messageContent", "zalgo")
const { message } = findByProps("message")
const { groupStart } = findByProps("groupStart")
const { wrapper } = findByProps("wrapper", "zalgo")
const { cozy } = findByProps("cozy", "zalgo")
const { contents } = findByProps("contents")
const { getUserAvatarURL } = findByProps("getUserAvatarURL")
const { getUser } = findByProps("getUser")
const { openUserProfileModal } = findByProps("openUserProfileModal")
const buttonClassNames = findByProps("button", "wrapper", "disabled")
const usernameClickable = findByProps("clickable", "username").clickable
const ConfirmModal = findByDisplayName("ConfirmModal")
const { markdown } = findByProps("markdown")

interface IState {
  profilePhoto: string
}

export default class ReviewComponent extends Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      profilePhoto: ""
    }
  }
  openModal = () => {
    if (stores.Users.getUser(this.props.review.senderdiscordid) === undefined) {
      getUser(this.props.review.senderdiscordid).then(user => {
        openUserProfileModal({ "userId": this.props.review.senderdiscordid })
      })
    } else {
      openUserProfileModal({ "userId": this.props.review.senderdiscordid })
    }
  }
  modalProps: any = { "cancelText": "Nop", "confirmText": "Yop", "header": "ARE YOU SURE ABOUT THAT" }

  deleteReview() {
    this.modalProps["children"] = (<h2 className={markdown}>DELETE THAT REVIEWW????</h2>)
    this.modalProps["onConfirm"] = () => {
      deleteReview(this.props.review.id).then(res => {
        if (res.successful) {
          this.props.fetchReviews()
        }
        showToast(res.message)
      })
    }
    ModalActions.openModal((prop) => (<ConfirmModal {...prop} {...this.modalProps}></ConfirmModal>))
  }

  reportReview() {
    this.modalProps["children"] = (<h2 className={markdown}>REPORT THAT REVIEWW????</h2>)
    this.modalProps["onConfirm"] = () => {
      reportReview(this.props.review.id)
    }
    ModalActions.openModal((prop) => (<ConfirmModal {...prop} {...this.modalProps}></ConfirmModal>))

  }

  fetchUser(){
    const review: Review = this.props.review

    var user = stores.Users.getUser(review.senderdiscordid)
    if (user === undefined) {
      Queue.push(() => getUser(review.senderdiscordid).then((u: any) => {this.setState({});review.profile_photo = getUserAvatarURL(u)}).then((m: any) => sleep(400)))
    } else {
      review.profile_photo = getUserAvatarURL(user)
      this.setState({})
    }
  }

  componentDidMount(): void {
    const review: Review = this.props.review

    if (!review.profile_photo || review.profile_photo === "") {
        this.fetchUser();
    }
  }

  render() {
    const review: Review = this.props.review

    return (
      <div>
        <div className={cozyMessage + " " + message + " " + groupStart + " " + wrapper + " " + cozy}>
          <div className={contents}>
            <img className={avatar + " " + clickable} onClick={() => { this.openModal() }} onError={()=>{ this.fetchUser() }} src={review.profile_photo === "" ? "/assets/1f0bfc0865d324c2587920a7d80c609b.png?size=128" : review.profile_photo}></img>
            <span className={username + " " + usernameClickable} style={{ color: "var(--text-muted)" }} onClick={() => this.openModal()}>{review.username}</span>
            <p className={messageContent} style={{ fontSize: 15, marginTop: 4 }}>{review.comment}</p>
            <div className={container + " " + isHeader + " " + buttons}>
              <div className={buttonClassNames.wrapper}>
                <MessageButton type="report" callback={() => this.reportReview()}></MessageButton>
                {(review.senderdiscordid === stores.Users.getCurrentUser().id) ? (<MessageButton type="delete" callback={() => this.deleteReview()}></MessageButton>) : <></>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}