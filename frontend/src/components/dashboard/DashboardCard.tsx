import React from "react";

type DashboardCardProps = {
    icon: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonColor: string;
    onClick?: () => void;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
    icon,
    title,
    description,
    buttonLabel,
    buttonColor,
    onClick,
}) => (
    <div className="dashboard-card">
        <div className="card-icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <button
            className="card-button"
            style={{ background: buttonColor }}
            onClick={onClick}
        >
            {buttonLabel}
        </button>
    </div>
);

export default DashboardCard;