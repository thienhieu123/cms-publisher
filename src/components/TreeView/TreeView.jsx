import { SimpleTreeView } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import { Box, Collapse } from "@mui/material";
import { TreeItem2Content, TreeItem2Label, TreeItem2Root } from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
import { forwardRef } from "react";
import BuildingIcon from "~/assets/images/icons/building.svg";
import PeopleIcon from "~/assets/images/icons/people.svg";
import ArrowDownIcon from "~/assets/images/icons/arrow-down-red.svg";
import { useSpring, animated } from "@react-spring/web";
import "./styles.css";

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 5 * props.layer + 15 : 0}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, icon, labelClassName, onChange, layer, ...other } =
    props;

  const { getRootProps, getContentProps, getLabelProps, getGroupTransitionProps, status } =
    useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });
  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root
        {...getRootProps(other)}
        onClick={(e) => {
          e.stopPropagation();
          onChange(itemId);
        }}
      >
        <CustomTreeItemContent {...getContentProps()}>
          <Box
            sx={{ flexGrow: 1, display: "flex", gap: 1, alignItems: "center" }}
            className={labelClassName}
          >
            {status.expandable && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "15px",
                  height: "15px",
                  transition: "all 0.2s ease",
                  transform: !status.expanded ? "rotateZ(-90deg)" : "",
                }}
              >
                <img src={ArrowDownIcon} alt="arrow icon" />
              </Box>
            )}
            <img src={icon} alt="icon" />
            <TreeItem2Label {...getLabelProps()} />
          </Box>
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} layer={layer} />}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

export default function TreeView(props) {
  const { data, onChange } = props;

  function renderTreeView(data) {
    return data?.map((item) => {
      if (item.layer > 0) {
        //item layer 2 trở đi
        return (
          <CustomTreeItem
            key={item.code}
            itemId={item.codeUnique ? item.codeUnique : item.code}
            label={item?.name}
            icon={PeopleIcon}
            layer={item?.layer}
            labelClassName={`child-item ${!item.children ? "parent-no-child" : ""}`}
            onChange={() => {
              onChange(item);
            }}
          >
            {renderTreeView(item?.children)}
          </CustomTreeItem>
        );
      } else {
        //item layer 1
        return (
          <CustomTreeItem
            key={item.code}
            itemId={item.codeUnique ? item.codeUnique : item.code}
            label={item?.name}
            icon={BuildingIcon}
            layer={item?.layer}
            labelClassName={`parent-item ${!item.children ? "parent-no-child" : ""}`}
            onChange={() => {
              onChange(item);
            }}
          >
            {renderTreeView(item?.children)}
          </CustomTreeItem>
        );
      }
    });
  }

  return <SimpleTreeView className="custom-tree-view">{renderTreeView(data)}</SimpleTreeView>;
}
