import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const TemplatesComponent: React.FC = (props: any) => {
  const dispatch = useDispatch();
  return <div></div>;
};

export const TemplatesPage = withRouter(TemplatesComponent);
