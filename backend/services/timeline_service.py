"""
Action Timeline Generation Service
Generates neutral, non-prescriptive action timelines
"""
import logging
from models.report import (
    SeverityLevel,
    ActionTimelineItem,
    ActionTimelinePhase,
    ActionTimelineResponse
)

logger = logging.getLogger(__name__)


# Base timeline templates by severity
TIMELINE_TEMPLATES = {
    SeverityLevel.LOW: {
        "now": [
            ActionTimelineItem(
                title="Review Report Summary",
                description="Look through the key findings and understand which parameters are in range",
                priority="low"
            ),
            ActionTimelineItem(
                title="Save for Records",
                description="Keep a copy of this report for your health records",
                priority="low"
            ),
        ],
        "short_term": [
            ActionTimelineItem(
                title="Routine Check-in",
                description="Consider discussing results at your next regular healthcare appointment",
                priority="low"
            ),
        ],
        "long_term": [
            ActionTimelineItem(
                title="Schedule Next Test",
                description="Plan for periodic health monitoring as recommended by your healthcare provider",
                priority="low"
            ),
            ActionTimelineItem(
                title="Maintain Healthy Habits",
                description="Continue with balanced nutrition and regular physical activity",
                priority="low"
            ),
        ]
    },
    SeverityLevel.MODERATE: {
        "now": [
            ActionTimelineItem(
                title="Review Complete Report",
                description="Examine all parameters and their reference ranges in detail",
                priority="immediate"
            ),
            ActionTimelineItem(
                title="Document Current Values",
                description="Keep a record of today's test results for future comparison",
                priority="immediate"
            ),
        ],
        "short_term": [
            ActionTimelineItem(
                title="Consult Healthcare Provider",
                description="Schedule an appointment to discuss parameters requiring attention",
                priority="high"
            ),
            ActionTimelineItem(
                title="Share Report with Specialist",
                description="Provide this analysis to your healthcare team for comprehensive evaluation",
                priority="high"
            ),
            ActionTimelineItem(
                title="Explore Related Information",
                description="Research reliable health resources about the identified parameters",
                priority="moderate"
            ),
        ],
        "long_term": [
            ActionTimelineItem(
                title="Follow-up Testing",
                description="Consider scheduling follow-up tests as recommended by healthcare provider",
                priority="moderate"
            ),
            ActionTimelineItem(
                title="Track Lifestyle Changes",
                description="Monitor any modifications to diet, exercise, or medication as advised",
                priority="moderate"
            ),
            ActionTimelineItem(
                title="Update Health Records",
                description="Upload new test reports to track longitudinal health trends",
                priority="low"
            ),
        ]
    },
    SeverityLevel.HIGH: {
        "now": [
            ActionTimelineItem(
                title="Review Critical Findings",
                description="Carefully note all parameters marked as requiring high attention",
                priority="immediate"
            ),
            ActionTimelineItem(
                title="Document All Values",
                description="Record all test values for discussion with healthcare providers",
                priority="immediate"
            ),
        ],
        "short_term": [
            ActionTimelineItem(
                title="Contact Healthcare Provider Promptly",
                description="Schedule an appointment as soon as possible to discuss findings",
                priority="immediate"
            ),
            ActionTimelineItem(
                title="Prepare Questions",
                description="Write down questions about your results to ask your healthcare provider",
                priority="high"
            ),
            ActionTimelineItem(
                title="Gather Related Records",
                description="Collect previous test results and relevant medical history",
                priority="high"
            ),
        ],
        "long_term": [
            ActionTimelineItem(
                title="Follow Provider Recommendations",
                description="Adhere to any guidance provided by your healthcare team",
                priority="high"
            ),
            ActionTimelineItem(
                title="Schedule Follow-up Tests",
                description="Plan for monitoring tests as directed by healthcare professionals",
                priority="high"
            ),
            ActionTimelineItem(
                title="Regular Monitoring",
                description="Establish a routine for ongoing health tracking",
                priority="moderate"
            ),
        ]
    }
}


def generate_action_timeline(severity: SeverityLevel) -> ActionTimelineResponse:
    """
    Generate action timeline based on severity level
    """
    template = TIMELINE_TEMPLATES.get(severity, TIMELINE_TEMPLATES[SeverityLevel.MODERATE])
    
    # Define timeframes and colors
    timeframe_config = [
        {"name": "Now", "key": "now", "color": "#3A9CA6"},
        {"name": "1–3 Days", "key": "short_term", "color": "#6B5B95"},
        {"name": "1 Month", "key": "long_term", "color": "#2F4A68"},
    ]
    
    phases = []
    for config in timeframe_config:
        actions = template.get(config["key"], [])
        phases.append(ActionTimelinePhase(
            timeframe=config["name"],
            color=config["color"],
            actions=actions
        ))
    
    return ActionTimelineResponse(
        severity_level=severity,
        phases=phases,
        disclaimer=(
            "These suggestions are for general guidance only. They do not constitute medical advice. "
            "Always follow the specific recommendations of qualified healthcare professionals."
        )
    )


def get_priority_color(priority: str) -> str:
    """Get color for action priority"""
    colors = {
        "immediate": "#3A9CA6",
        "high": "#C89B3C",
        "moderate": "#6B5B95",
        "low": "#E5E9ED"
    }
    return colors.get(priority, "#E5E9ED")
