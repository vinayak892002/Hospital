// ** Third Party Components
import Proptypes from "prop-types";
import classnames from "classnames";

const colorOptions = ["danger", "success", "warning", "primary"];

const Timeline = (props) => {
  // ** Props
  const { data, tag, className, setFileData } = props;

  // ** Custom Tagg
  const Tag = tag ? tag : "ul";

  return (
    <Tag
      className={classnames("timeline", {
        [className]: className,
      })}
      style={{
        height: "450px",
        width: "100%",
        overflowY: "scroll",
        margin: "0",
        paddingLeft: "5px",
      }}
    >
      {data.map((item, i) => {
        const ItemTag = item.tag ? item.tag : "li";

        return (
          <ItemTag
            key={i}
            className={classnames("timeline-item", {
              [item.className]: className,
            })}
          >
            <span
              className={classnames("timeline-point", {
                [`timeline-point-${colorOptions[i % colorOptions.length]}`]:
                  colorOptions[i % colorOptions.length],
                "timeline-point-indicator": !item.icon,
              })}
            >
              {item.icon ? item.icon : null}
            </span>
            <div className="timeline-event">
              <div
                className={classnames(
                  "d-flex justify-content-between flex-sm-row flex-column",
                  {
                    "mb-sm-0 mb-1": item.meta,
                  }
                )}
              >
                <h6>{item.title}</h6>
                {item.meta ? (
                  <span
                    className={classnames("timeline-event-time", {
                      [item.metaClassName]: item.metaClassName,
                    })}
                  >
                    {item.meta}
                  </span>
                ) : null}
              </div>
              <p>{item.remark}</p>
              <>
                {item.dataLinks && item.dataLinks.length > 0 && (
                  <div className="d-flex align-items-center">
                    <span
                      className="fw-bold fs-5 text-secondary cursor-pointer"
                      style={{
                        paddingBottom: "2px",
                        borderBottom: "1px solid #098fb5",
                        width: "fit-content",
                      }}
                      onClick={() => {
                        setFileData(item.dataLinks);
                      }}
                    >
                      File Data
                    </span>
                  </div>
                )}

                <div
                  className="d-flex align-items-center"
                  style={{ marginTop: "5px" }}
                >
                  <span className="fw-bold" style={{ marginRight: "5px" }}>
                    Stage:{" "}
                  </span>
                  <span>{`${item.event}`}</span>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ marginTop: "5px" }}
                >
                  <span className="fw-bold" style={{ marginRight: "5px" }}>
                    Updated By:{" "}
                  </span>
                  <span>{`${item.updateBy}`}</span>
                </div>
              </>
            </div>
          </ItemTag>
        );
      })}
    </Tag>
  );
};

export default Timeline;

// ** PropTypes
Timeline.propTypes = {
  tag: Proptypes.string,
  className: Proptypes.string,
  data: Proptypes.array.isRequired,
};
