
import { find, findByProps } from 'ittai/webpack'
import React, { Component } from 'react'
import ReviewComponent from "./ReviewComponent";


type ReviewsViewProps = {
    reviews: Array<any>
}


export default class ReviewsView extends Component<ReviewsViewProps> {
    render() {
        return (
            <div>
               {
                    this.props.reviews.map(review => {
                        return <ReviewComponent username={review["username"]} comment={review["comment"]} discordid={12}></ReviewComponent>
                    })
               }
            </div>
        )
    }

}
