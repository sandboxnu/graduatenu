class PlanChangelogsController < ApplicationController
    before_action :set_plan
    before_action :set_user
    before_action :set_plan_changelog, only: [:show]

    def index
        if @plan
            @plan_comments = @plan.plan_changelogs.order(:created_at)
        else 
            render json: {error: "No such plan."}, status: :unprocessable_entity
        end
    end

    def show
        if @plan_changelog
            render :show
        else
            render json: {error: "No such plan changelog."}, status: :unprocessable_entity
        end
    end

    def create
        if @plan_changelog = PlanChangelog.create(plan_changelog_params.merge({plan_id: params[:plan_id]}))
            render :show
        else
            render json: {error: "Unable to store plan changelog."}, status: :unprocessable_entity
        end
    end

    def set_plan
        @plan = Plan.find_by_id(params[:plan_id])
    end

    def set_user
        @user = User.find_by_id(params[:user_id])
    end

    def set_plan_changelog
        @plan_comment = PlanChangelog.find_by_id(params[:id])
    end

    def plan_changelog_params
        params.require(:plan_comment).permit(:log)
    end
end

