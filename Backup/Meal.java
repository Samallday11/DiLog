@Entity
@Table(name = "meals")
@Data
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "json")
    private String macros;

    private Integer calories;
    private String type;

    @Column(columnDefinition = "text[]")
    private String[] tags;
}
