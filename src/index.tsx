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
const defaultLineStyle = "solid";
const defaultTimeTextColor = "black";
const defaultDotColor = "white";
const defaultInnerCircle = "none";
const isRtl = I18nManager.isRTL;

interface TimelineSharedStyleProps {
	lineWidth?: number;
	lineColor?: string;
	lineStyle?: "solid" | "dashed" | "dotted";
	circleSize?: number;
	circleColor?: string;
	dotColor?: string;
	titleStyle?: StyleProp<TextStyle>;
	descriptionStyle?: StyleProp<TextStyle>;
	eventContainerStyle?: StyleProp<ViewStyle>;
}

type Data = TimelineSharedStyleProps & {
	time?: string;
	title?: string;
	description?: any;
	eventContainerStyle?: StyleProp<ViewStyle>;
		
	icon?: string | React.ReactNode;
	position?: "left" | "right";
	iconDefault?: string;
};

interface TimelineProps extends TimelineSharedStyleProps {
	data: Data[] | any;
	innerCircle?: "none" | "icon" | "dot" | "element";
	separator?: boolean;
	columnFormat?: "single-column-left" | "single-column-right" | "two-column";
	
	dotSize?: number;
	iconDefault?: string | React.ReactNode;
	style?: StyleProp<ViewStyle>;
	circleStyle?: StyleProp<ViewStyle>;
	listViewStyle?: StyleProp<ViewStyle>;
	listViewContainerStyle?: StyleProp<ViewStyle>;
	timeStyle?: StyleProp<TextStyle>;
	
	iconStyle?: StyleProp<ImageStyle>;
	separatorStyle?: StyleProp<ViewStyle>;
	rowContainerStyle?: StyleProp<ViewStyle>;
	
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
	isAllowFontScaling?: boolean;
}

const Timeline = memo(function Timeline({
	circleSize = defaultCircleSize,
	circleColor = defaultCircleColor,
	lineWidth = defaultLineWidth,
	lineColor = defaultLineColor,
	lineStyle = defaultLineStyle,
	innerCircle = defaultInnerCircle,
	columnFormat = "single-column-left",
	separator = false,
	showTime = true,
	isAllowFontScaling = true,
	isUsingFlatlist = true,
	...props
}: TimelineProps) {
	const [x, setX] = useState(0);
	const [width, setWidth] = useState(0);
	const [data, setData] = useState(props.data);

	function _renderSeparator() {
		if (!separator) {
			return null;
		}

		return <View style={[styles.separator, props.separatorStyle]} />;
	}

	function _renderCircle(rowData: Data, rowID: number) {
		let _circleSize = rowData.circleSize
			? rowData.circleSize
			: circleSize
			? circleSize
			: defaultCircleSize;
		let _circleColor = rowData.circleColor
			? rowData.circleColor
			: circleColor
			? circleColor
			: defaultCircleColor;
		let _lineWidth = rowData.lineWidth
			? rowData.lineWidth
			: lineWidth
			? lineWidth
			: defaultLineWidth;

		let circleStyle: any = null;

		switch (columnFormat) {
			case "single-column-left":
				circleStyle = isRtl
					? {
							width: width ? _circleSize : 0,
							height: width ? _circleSize : 0,
							borderRadius: _circleSize / 2,
							backgroundColor: _circleColor,
							right:
								width - _circleSize / 2 - (_lineWidth - 1) / 2,
					  }
					: {
							width: x ? _circleSize : 0,
							height: x ? _circleSize : 0,
							borderRadius: _circleSize / 2,
							backgroundColor: _circleColor,
							left: x - _circleSize / 2 + (_lineWidth - 1) / 2,
					  };
				break;
			case "single-column-right":
				circleStyle = {
					width: width ? _circleSize : 0,
					height: width ? _circleSize : 0,
					borderRadius: _circleSize / 2,
					backgroundColor: _circleColor,
					left: width - _circleSize / 2 - (_lineWidth - 1) / 2,
				};
				break;
			case "two-column":
				circleStyle = {
					width: width ? _circleSize : 0,
					height: width ? _circleSize : 0,
					borderRadius: _circleSize / 2,
					backgroundColor: _circleColor,
					left: width - _circleSize / 2 - (_lineWidth - 1) / 2,
				};
				break;
		}

		var _innerCircle: any = null;
		switch (innerCircle) {
			case "icon":
				let iconDefault = rowData.iconDefault
					? rowData.iconDefault
					: props.iconDefault;
				let iconSource = rowData.icon ? rowData.icon : iconDefault;
				if (React.isValidElement(iconSource)) {
					_innerCircle = iconSource;
					break;
				}
				if (rowData.icon)
					iconSource =
						rowData.icon.constructor === String
							? { uri: rowData.icon }
							: rowData.icon;
				let iconStyle = {
					height: _circleSize,
					width: _circleSize,
				};
				_innerCircle = (
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
				const dotSize = props.dotSize ? props.dotSize : _circleSize / 2;
				let dotStyle = {
					height: dotSize,
					width: dotSize,
					borderRadius: _circleSize / 2,
					backgroundColor: rowData.dotColor
						? rowData.dotColor
						: props.dotColor
						? props.dotColor
						: defaultDotColor,
				};
				_innerCircle = <View style={[styles.dot, dotStyle]} />;
				break;
			case "element":
				_innerCircle = rowData.icon;
				break;
		}
		return (
			<View style={[styles.circle, circleStyle, props.circleStyle]}>
				{_innerCircle}
			</View>
		);
	}

	function _renderDetail(rowData: Data, rowID: number) {
		let description: any;
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

	function _renderEvent(rowData: Data, rowID: number) {
		const _lineWidth = rowData.lineWidth ? rowData.lineWidth : lineWidth;
		const _lineStyle = rowData.lineStyle ? rowData.lineStyle : lineStyle;
		const _isLast = props.renderFullLine
			? !props.renderFullLine
			: data.slice(-1)[0] === rowData;
		const _lineColor = _isLast
			? "rgba(0,0,0,0)"
			: rowData.lineColor
			? rowData.lineColor
			: lineColor;
		let opStyle: any = null;

		switch (columnFormat) {
			case "single-column-left":
				opStyle = {
					borderColor: _lineColor,
					borderLeftWidth: _lineWidth,
					borderRightWidth: 0,
					marginLeft: 20,
					borderStyle: _lineStyle,
					paddingLeft: 20,
				};
				break;
			case "single-column-right":
				opStyle = {
					borderColor: _lineColor,
					borderLeftWidth: 0,
					borderRightWidth: _lineWidth,
					borderStyle: _lineStyle,
					marginRight: 20,
					paddingRight: 20,
				};
				break;
			case "two-column":
				opStyle =
					(rowData.position && rowData.position == "right") ||
					(!rowData.position && rowID % 2 == 0)
						? {
								borderColor: _lineColor,
								borderLeftWidth: _lineWidth,
								borderStyle: _lineStyle,
								borderRightWidth: 0,
								marginLeft: 20,
								paddingLeft: 20,
						  }
						: {
								borderColor: _lineColor,
								borderLeftWidth: 0,
								borderRightWidth: _lineWidth,
								borderStyle: _lineStyle,
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
						const { x: newX, width: newWidth } =
							evt.nativeEvent.layout;
						setX(newX);
						setWidth(newWidth);
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

	function _renderTime(rowData: Data, rowID: number) {
		if (!showTime) {
			return null;
		}
		var timeWrapper: any = null;
		switch (columnFormat) {
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

	function _renderItem({ item, index }: { item: Data; index: number }) {
		let content: any = null;
		switch (columnFormat) {
			case "single-column-left":
				content = (
					<View
						style={[styles.rowContainer, props.rowContainerStyle]}
					>
						{renderTime(item, index)}
						{renderEvent(item, index)}
						{renderCircle(item, index)}
					</View>
				);
				break;
			case "single-column-right":
				content = (
					<View
						style={[styles.rowContainer, props.rowContainerStyle]}
					>
						{renderEvent(item, index)}
						{renderTime(item, index)}
						{renderCircle(item, index)}
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
							{renderTime(item, index)}
							{renderEvent(item, index)}
							{renderCircle(item, index)}
						</View>
					) : (
						<View
							style={[
								styles.rowContainer,
								props.rowContainerStyle,
							]}
						>
							{renderEvent(item, index)}
							{renderTime(item, index)}
							{renderCircle(item, index)}
						</View>
					);
				break;
		}
		return <View key={index}>{content}</View>;
	}

	const renderTime = props.renderTime ? props.renderTime : _renderTime;
	const renderDetail = props.renderDetail
		? props.renderDetail
		: _renderDetail;
	const renderCircle = props.renderCircle
		? props.renderCircle
		: _renderCircle;
	const renderEvent = _renderEvent;

	return (
		<View style={[styles.container, props.style]}>
			{isUsingFlatlist ? (
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
				data.map((item: Data, index: number) => (
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
