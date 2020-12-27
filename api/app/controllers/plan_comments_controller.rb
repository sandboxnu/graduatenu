class PlanCommentsController < ApplicationController
    before_action :set_plan

    def index
        if @plan
            @plan_comments = @plan.plan_comments
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
        if @plan_comment = PlanComment.create(plan_comment_params)
            render :show
        else
            render json: {error: "Unable to store plan comment."}, status: :unprocessable_entity
        end
    end

    def set_plan
        @plan = Plan.find_by_id(plan_comment_params[:plan_id])
    end

    def plan_comment_params
        params.require(:plan_comment).permit(:plan_id, :user_id, :timestamp, :comment)
    end
end