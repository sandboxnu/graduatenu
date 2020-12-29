class PlanCommentsController < ApplicationController
    before_action :set_plan
    before_action :set_plan_comment, only: [:show]

    def index
        if @plan
            @plan_comments = @plan.plan_comments.order(:created_at)
        else 
            render json: {error: "No such plan."}, status: :unprocessable_entity
        end
    end

    def show
        if @plan_comment
            render :show
        else
            render json: {error: "No such plan."}, status: :unprocessable_entity
        end
    end

    def create
        if @plan_comment = PlanComment.create(plan_comment_params.merge({plan_id: params[:plan_id]}))
            render :show
        else
            render json: {error: "Unable to store plan comment."}, status: :unprocessable_entity
        end
    end

    def set_plan
        @plan = Plan.find_by_id(params[:plan_id])
    end

    def set_plan_comment
        @plan_comment = PlanComment.find_by_id(params[:id])
    end

    def plan_comment_params
        params.require(:plan_comment).permit(:author, :comment)
    end
end