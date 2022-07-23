
import { TextInput } from 'ittai/components';
import { findByProps } from 'ittai/webpack';
import React, { Component, useState } from 'react'
import { addReview, getReviews } from '../Utils/ReviewDBAPI';
import ReviewComponent from "./ReviewComponent";
import { Review } from "../entities/Review";
const {withReact, Slate,DefaultEditable } = findByProps("Editable")
type ReviewsViewProps = {
    userid: number
}
interface IState {
    reviews: any[];
}

export const Queue = {
    last: Promise.resolve(),
    push(func:any) {
        return (this.last = this.last.then(func));
    }
};
export default class ReviewsView extends Component<any,IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            reviews : []
        }
    }
    fetchReviews = () => {
        getReviews(this.props.userid).then(reviews => {
            console.log(reviews)
            this.setState({ reviews: reviews });
        })
    }

    componentDidMount(): void {
        const reviews = this.state.reviews
        
        if (reviews.length === 0) { 
            this.fetchReviews()
        }
    }   

    onKeyPress(keyEvent:any) {
        if (keyEvent.key === "Enter") {
            addReview({
                "userid": this.props.userid,
                "comment":keyEvent.target.value,
                "star":-1
            }).then(response => {
                if (response === 0 || response === 1 ) {
                    keyEvent.target.value = "" // clear the input
                    this.fetchReviews()
                }
            })
        }

    }

    render() {
        const reviews = this.state.reviews

        return (
            <div>
                {
                    (reviews.length !== 0) ? (reviews.map(review => {
                        return <ReviewComponent review={review} />
                    })) : (<div>Loading...</div>)
                }
                
                <TextInput placeholder='Enter a comment' onKeyPress ={(e)=>this.onKeyPress(e)}></TextInput>                
            </div>
        )
    }

}
