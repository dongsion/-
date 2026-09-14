# Requirements Document

## Introduction

为「杯套收藏馆」移除贡献榜功能，并新增「相框」功能：用户可将已上传的杯套自由拖入一个相框画布，拖动、缩放、旋转摆放，布局本地保存，并可导出为 PNG 图片。

## Glossary

- **相框画布（Frame Canvas）**：固定 4:3 比例的编辑区域，代表实物相框。
- **相框元素（Frame Item）**：相框画布中的一只杯套图片，具有位置、缩放和旋转属性。
- **杯套托盘（Tray）**：位于相框画布下方，列出所有已上传杯套的缩略图。
- **布局（Layout）**：相框内全部元素及其位置、缩放、旋转、层级的集合。

## Requirements

### Requirement 1：移除贡献榜

**User Story:** AS 收藏馆用户，I want 移除贡献榜，so that 界面只保留收藏与相框相关功能。

#### Acceptance Criteria

1. The 系统 SHALL 不显示贡献榜页面入口。
2. The 系统 SHALL 不显示贡献榜页面内容。
3. The 系统 SHALL 在底部导航第二个位置显示「相框」入口。

### Requirement 2：加入相框

**User Story:** AS 收藏馆用户，I want 把已上传的杯套加入相框，so that 我可以把它们拼成一面杯套墙。

#### Acceptance Criteria

1. The 相框页面 SHALL 在托盘列出全部已上传杯套。
2. WHEN 用户点击托盘中的一只杯套，the 系统 SHALL 将该杯套作为一个相框元素加入相框画布中央区域。
3. IF 收藏馆中没有任何已上传杯套，the 托盘 SHALL 显示引导用户先上传的提示。
4. WHEN 相框画布为空，the 相框画布 SHALL 显示引导用户加入杯套的提示。

### Requirement 3：自由摆放

**User Story:** AS 收藏馆用户，I want 自由拖动、缩放、旋转相框元素，so that 我可以排出理想布局。

#### Acceptance Criteria

1. WHEN 用户拖动相框元素，the 元素 SHALL 跟随指针移动。
2. WHEN 用户拖动相框元素，the 元素中心 SHALL 保持在相框画布范围内。
3. WHEN 用户拖动缩放控制柄，the 元素 SHALL 以元素中心为基准改变尺寸。
4. WHEN 用户拖动旋转控制柄，the 元素 SHALL 以元素中心为基准旋转。
5. WHEN 用户选中相框元素，the 元素 SHALL 显示缩放控制柄、旋转控制柄和移除控制柄。
6. WHEN 用户点击移除控制柄，the 系统 SHALL 从相框中移除该元素。

### Requirement 4：保存布局

**User Story:** AS 收藏馆用户，I want 布局自动保存，so that 下次打开时相框保持原样。

#### Acceptance Criteria

1. WHEN 相框布局发生变化，the 系统 SHALL 将布局保存到浏览器本地存储。
2. WHEN 用户重新打开相框页面，the 系统 SHALL 恢复已保存的布局。
3. WHEN 用户删除某只杯套，the 系统 SHALL 从相框中移除引用该杯套的元素。
4. WHEN 用户点击「清空相框」并确认，the 系统 SHALL 清空全部相框元素。

### Requirement 5：导出图片

**User Story:** AS 收藏馆用户，I want 导出相框为图片，so that 我可以保存或分享。

#### Acceptance Criteria

1. WHEN 用户点击「导出图片」，the 系统 SHALL 生成一张包含当前布局的 PNG 图片并触发下载。
2. IF 相框为空，the 系统 SHALL 提示相框为空且不生成图片。
3. The 导出图片 SHALL 使用与相框画布一致的比例和元素位置、缩放、旋转、层级。
