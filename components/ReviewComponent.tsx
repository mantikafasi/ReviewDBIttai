import { stores } from 'ittai';
import { findByProps } from 'ittai/webpack';
import React, { Component } from 'react'
import { Review } from '../entities/Review';
import { Queue } from './ReviewsView';

const cozyMessage = findByProps("cozyMessage").cozyMessage
const avatar = findByProps("avatar", "zalgo").avatar
const username = findByProps("header", "zalgo").header
const messageContent = findByProps("messageContent", "zalgo").messageContent
const message = findByProps("message").message
const groupStart = findByProps("groupStart").groupStart
const wrapper = findByProps("wrapper", "zalgo").wrapper
const cozy = findByProps("cozy", "zalgo").cozy
const { contents } = findByProps("contents")
const { getUserAvatarURL } = findByProps("getUserAvatarURL")
const { getUser } = findByProps("getUser")
const { openUserProfileModal } = findByProps("openUserProfileModal")

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
  openModal = ()=>{
      openUserProfileModal({"userId":this.props.review.senderdiscordid})
  }

  render() {
    const review: Review = this.props.review
    if (this.state.profilePhoto === "") {
      var user = stores.Users.getUser(review.senderdiscordid)
      if (user === undefined) {
        Queue.push(() => getUser(review.senderdiscordid).then((u:any) => this.setState({ profilePhoto: getUserAvatarURL(u) })))
      } else {
        this.setState({ profilePhoto: getUserAvatarURL(user) })
      }

    }

    return (
      <div>
        <div className={cozyMessage + " " + message + " " + groupStart + " " + wrapper + " " + cozy}>
          <div className={contents}>
            <img className={avatar} onClick={()=>{this.openModal()}} src={this.state.profilePhoto === "" ? "https://github.com/Aliucord.png?size=80" : this.state.profilePhoto}></img>


            <h2 className={username} onClick={()=>this.openModal()}>{review.username}</h2>
            <p className={messageContent}>{review.comment}</p>
          </div>
        </div>
      </div>
    )
  }
}
