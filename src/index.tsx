"use strict";

import {
	FlatList,
	FlatListProps,
	I18nManager,
	Image,
	ImageStyle,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";
import React, { memo, useState } from "react";

const defaultCircleSize = 16;
const defaultCircleColor = "#007AFF";
const defaultLineWidth = 2;
const defaultLineColor = "#007AFF";
const defaultTimeTextColor = "black";
const defaultDotColor = "white";
const defaultInnerCircle = "none";
const isRtl = I18nManager.isRTL;

type Data = {
	time?: string;
	title?: string;
	description?: any;
	lineWidth?: number;
	lineColor?: string;
	eventContainerStyle?: StyleProp<ViewStyle>;
	circleSize?: number;
	circleColor?: string;
	dotColor?: string;
	icon?: string | React.ReactNode;
	position?: "left" | "right";
	iconDefault?: string;
};

interface TimelineProps {
	data: Data[] | any;
	innerCircle?: "none" | "icon" | "dot" | "element";
	separator?: boolean;
	columnFormat?: "single-column-left" | "single-column-right" | "two-column";
	lineWidth?: number;
	lineColor?: string;
	circleSize?: number;
	circleColor?: string;
	dotColor?: string;
	dotSize?: number;
	iconDefault?: string | React.ReactNode;
	style?: StyleProp<ViewStyle>;
	circleStyle?: StyleProp<ViewStyle>;
	listViewStyle?: StyleProp<ViewStyle>;
	listViewContainerStyle?: StyleProp<ViewStyle>;
	timeStyle?: StyleProp<TextStyle>;
	titleStyle?: StyleProp<TextStyle>;
	descriptionStyle?: StyleProp<TextStyle>;
	iconStyle?: StyleProp<ImageStyle>;
	separatorStyle?: StyleProp<ViewStyle>;
	rowContainerStyle?: StyleProp<ViewStyle>;
	eventContainerStyle?: StyleProp<ViewStyle>;
	eventDetailStyle?: StyleProp<ViewStyle>;
	timeContainerStyle?: StyleProp<ViewStyle>;
	detailContainerStyle?: StyleProp<ViewStyle>;
	onEventPress?: (event: Event) => any;
	renderTime?: (rowData: Data | any, rowID: number) => any;
	renderDetail?: (rowData: Data | any, rowID: number) => any;
	renderCircle?: (rowData: Data | any, rowID: number) => any;
	renderFullLine?: boolean;
	options?: Partial<FlatListProps<Data>>;
	showTime?: boolean;
	isUsingFlatlist?: boolean;
}

const Timeline = memo(function Timeline(props: TimelineProps) {
	const [x, setX] = useState(0);
	const [width, setWidth] = useState(0);
	const [data, setData] = useState(props.data);

	function _renderSeparator() {
		if (!props.separator) {
			return null;
		}

		return <View style={[styles.separator, props.separatorStyle]} />;
	}

	function _renderCircle(rowData: Data) {
		let circleSize = rowData.circleSize
			? rowData.circleSize
			: props.circleSize
			? props.circleSize
			: defaultCircleSize;
		let circleColor = rowData.circleColor
			? rowData.circleColor
			: props.circleColor
			? props.circleColor
			: defaultCircleColor;
		let lineWidth = rowData.lineWidth
			? rowData.lineWidth
			: props.lineWidth
			? props.lineWidth
			: defaultLineWidth;

		let circleStyle: any = null;

		switch (props.columnFormat) {
			case "single-column-left":
				circleStyle = isRtl
					? {
							width: width ? circleSize : 0,
							height: width ? circleSize : 0,
							borderRadius: circleSize / 2,
							backgroundColor: circleColor,
							right:
								width -
								circleSize / 2 -
								(lineWidth - 1) / 2,
					  }
					: {
							width: x ? circleSize : 0,
							height: x ? circleSize : 0,
							borderRadius: circleSize / 2,
							backgroundColor: circleColor,
							left:
								x -
								circleSize / 2 +
								(lineWidth - 1) / 2,
					  };
				break;
			case "single-column-right":
				circleStyle = {
					width: width ? circleSize : 0,
					height: width ? circleSize : 0,
					borderRadius: circleSize / 2,
					backgroundColor: circleColor,
					left:
						width - circleSize / 2 - (lineWidth - 1) / 2,
				};
				break;
			case "two-column":
				circleStyle = {
					width: width ? circleSize : 0,
					height: width ? circleSize : 0,
					borderRadius: circleSize / 2,
					backgroundColor: circleColor,
					left:
						width - circleSize / 2 - (lineWidth - 1) / 2,
				};
				break;
		}

		var innerCircle: any = null;
		switch (props.innerCircle) {
			case "icon":
				let iconDefault = rowData.iconDefault
					? rowData.iconDefault
					: props.iconDefault;
				let iconSource = rowData.icon ? rowData.icon : iconDefault;
				if (React.isValidElement(iconSource)) {
					innerCircle = iconSource;
					break;
				}
				if (rowData.icon)
					iconSource =
						rowData.icon.constructor === String
							? { uri: rowData.icon }
							: rowData.icon;
				let iconStyle = {
					height: circleSize,
					width: circleSize,
				};
				innerCircle = (
					<Image
						source={iconSource}
						defaultSource={
							typeof iconDefault === "number" && iconDefault
						}
						style={[iconStyle, props.iconStyle]}
					/>
				);
				break;
			case "dot":
				const dotSize = props.dotSize ? props.dotSize : circleSize / 2;
				let dotStyle = {
					height: dotSize,
					width: dotSize,
					borderRadius: circleSize / 4,
					backgroundColor: rowData.dotColor
						? rowData.dotColor
						: props.dotColor
						? props.dotColor
						: defaultDotColor,
				};
				innerCircle = <View style={[styles.dot, dotStyle]} />;
				break;
			case "element":
				innerCircle = rowData.icon;
				break;
		}
		return (
			<View style={[styles.circle, circleStyle, props.circleStyle]}>
				{innerCircle}
			</View>
		);
	}

	function _renderDetail(rowData: Data) {
		const { isAllowFontScaling } = props;
		let description;
		if (typeof rowData.description === "string") {
			description = (
				<Text
					style={[
						styles.description,
						props.descriptionStyle,
						rowData.descriptionStyle,
					]}
					allowFontScaling={isAllowFontScaling}
				>
					{rowData.description}
				</Text>
			);
		} else if (typeof rowData.description === "object") {
			description = rowData.description;
		}

		return (
			<View style={styles.container}>
				<Text
					style={[styles.title, props.titleStyle, rowData.titleStyle]}
					allowFontScaling={isAllowFontScaling}
				>
					{rowData.title}
				</Text>
				{description}
			</View>
		);
	}

	function _renderEvent(rowData: Data, rowID) {
		const lineWidth = rowData.lineWidth
			? rowData.lineWidth
			: props.lineWidth;
		const isLast = props.renderFullLine
			? !props.renderFullLine
			: data.slice(-1)[0] === rowData;
		const lineColor = isLast
			? "rgba(0,0,0,0)"
			: rowData.lineColor
			? rowData.lineColor
			: props.lineColor;
		let opStyle: any = null;

		switch (props.columnFormat) {
			case "single-column-left":
				opStyle = {
					borderColor: lineColor,
					borderLeftWidth: lineWidth,
					borderRightWidth: 0,
					marginLeft: 20,
					paddingLeft: 20,
				};
				break;
			case "single-column-right":
				opStyle = {
					borderColor: lineColor,
					borderLeftWidth: 0,
					borderRightWidth: lineWidth,
					marginRight: 20,
					paddingRight: 20,
				};
				break;
			case "two-column":
				opStyle =
					(rowData.position && rowData.position == "right") ||
					(!rowData.position && rowID % 2 == 0)
						? {
								borderColor: lineColor,
								borderLeftWidth: lineWidth,
								borderRightWidth: 0,
								marginLeft: 20,
								paddingLeft: 20,
						  }
						: {
								borderColor: lineColor,
								borderLeftWidth: 0,
								borderRightWidth: lineWidth,
								marginRight: 20,
								paddingRight: 20,
						  };
				break;
		}

		return (
			<View
				style={[
					styles.details,
					opStyle,
					props.eventContainerStyle,
					rowData.eventContainerStyle,
				]}
				onLayout={(evt) => {
					if (!x && !width) {
						const { x: newX, width: newWidth } = evt.nativeEvent.layout;
						setX(newX)
						setWidth(newWidth)
					}
				}}
			>
				<TouchableOpacity
					disabled={props.onEventPress == null}
					style={[props.detailContainerStyle]}
					onPress={() =>
						props.onEventPress ? props.onEventPress(rowData) : null
					}
				>
					<View style={[styles.detail, props.eventDetailStyle]}>
						{renderDetail(rowData, rowID)}
					</View>
					{_renderSeparator()}
				</TouchableOpacity>
			</View>
		);
	}

	function _renderTime(rowData: Data) {
		if (!props.showTime) {
			return null;
		}
		var timeWrapper: any = null;
		switch (props.columnFormat) {
			case "single-column-left":
				timeWrapper = {
					alignItems: "flex-end",
				};
				break;
			case "single-column-right":
				timeWrapper = {
					alignItems: "flex-start",
				};
				break;
			case "two-column":
				timeWrapper = {
					flex: 1,
					alignItems:
						(rowData.position && rowData.position == "right") ||
						(!rowData.position && rowID % 2 == 0)
							? "flex-end"
							: "flex-start",
				};
				break;
		}
		const { isAllowFontScaling } = props;
		return (
			<View style={timeWrapper}>
				<View style={[styles.timeContainer, props.timeContainerStyle]}>
					<Text
						style={[styles.time, props.timeStyle]}
						allowFontScaling={isAllowFontScaling}
					>
						{rowData.time}
					</Text>
				</View>
			</View>
		);
	}

	function _renderItem({ item, index }) {
		let content: any = null;
		switch (props.columnFormat) {
			case "single-column-left":
				content = (
					<View
						style={[styles.rowContainer, props.rowContainerStyle]}
					>
						{renderTime(item)}
						{renderEvent(item, index)}
						{renderCircle(item)}
					</View>
				);
				break;
			case "single-column-right":
				content = (
					<View
						style={[styles.rowContainer, props.rowContainerStyle]}
					>
						{renderEvent(item, index)}
						{renderTime(item)}
						{renderCircle(item)}
					</View>
				);
				break;
			case "two-column":
				content =
					(item.position && item.position == "right") ||
					(!item.position && index % 2 == 0) ? (
						<View
							style={[
								styles.rowContainer,
								props.rowContainerStyle,
							]}
						>
							{renderTime(item)}
							{renderEvent(item, index)}
							{renderCircle(item)}
						</View>
					) : (
						<View
							style={[
								styles.rowContainer,
								props.rowContainerStyle,
							]}
						>
							{renderEvent(item)}
							{renderTime(item)}
							{renderCircle(item)}
						</View>
					);
				break;
		}
		return <View key={index}>{content}</View>;
	}

	const renderTime = (props.renderTime ? props.renderTime : _renderTime).bind(
		this
	);
	const renderDetail = (
		props.renderDetail ? props.renderDetail : _renderDetail
	).bind(this);
	const renderCircle = (
		props.renderCircle ? props.renderCircle : _renderCircle
	).bind(this);
	const renderEvent = _renderEvent;

	return (
		<View style={[styles.container, props.style]}>
			{props.isUsingFlatlist ? (
				<FlatList
					style={[styles.listview, props.listViewStyle]}
					contentContainerStyle={props.listViewContainerStyle}
					data={data}
					extraData={x}
					renderItem={_renderItem}
					keyExtractor={(item, index) => index + ""}
					{...props.options}
				/>
			) : (
				data.map((item, index) => (
					<View key={index + ""}>{_renderItem({ item, index })}</View>
				))
			)}
		</View>
	);
});

export default Timeline;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listview: {
		flex: 1,
	},
	sectionHeader: {
		marginBottom: 15,
		backgroundColor: "#007AFF",
		height: 30,
		justifyContent: "center",
	},
	sectionHeaderText: {
		color: "#FFF",
		fontSize: 18,
		alignSelf: "center",
	},
	rowContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "center",
	},
	timeContainer: {
		minWidth: 45,
	},
	time: {
		textAlign: "right",
		color: defaultTimeTextColor,
		overflow: "hidden",
	},
	circle: {
		width: 16,
		height: 16,
		borderRadius: 10,
		zIndex: 1,
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: defaultDotColor,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	details: {
		borderLeftWidth: defaultLineWidth,
		flexDirection: "column",
		flex: 1,
	},
	detail: { paddingTop: 10, paddingBottom: 10 },
	description: {
		marginTop: 10,
	},
	separator: {
		height: 1,
		backgroundColor: "#aaa",
		marginTop: 10,
		marginBottom: 10,
	},
});
